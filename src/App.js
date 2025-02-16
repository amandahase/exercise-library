import React, { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";

import TextDetails from "./Components/TextDetails";
import SearchInput from "./Components/SearchInput";
import Button from "./Components/Button";

function App() {
  const [fullExerciseList, setFullExerciseList] = useState([]);
  const [filteredExerciseList, setFilteredExerciseList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedExercise, setSelectedExercise] = useState({});
  const [isExerciseSelected, setIsExerciseSelected] = useState(false);
  const [selectedExerciseLevel, setSelectedExerciseLevel] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);

  const getExerciseList = () => {
    axios.get("https://candidate.staging.future.co/sandbox/api/exercises")
    .then((exercises) => {
      setFullExerciseList(exercises.data);
      setFilteredExerciseList(exercises.data);
    }).catch(() => {
      setErrorMessage("Oops!  We had trouble fetching the list of exercises.");
    });
  };

  const getExerciseLevel = () => {
    axios.get(`https://candidate.staging.future.co/sandbox/api/exercises/${selectedExercise.id}/predictions`)
    .then((prediction) => {
      setSelectedExerciseLevel(prediction.data.skill_level.level);
    }).catch(() => {
      setErrorMessage("Oops!  We had trouble fetching the predicted level for this exercise.");
    });
  };

  useEffect(() => {
    getExerciseList();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedExercise).length !== 0) {
      getExerciseLevel();
      setIsExerciseSelected(true);
    } else {
      setIsExerciseSelected(false);
    }
  }, [selectedExercise]);

  useEffect(() => {
    const searchedList = fullExerciseList.filter((e) => e.name.toLowerCase().includes(searchValue.toLowerCase()) || searchValue === "");

    setFilteredExerciseList(searchedList);
  }, [searchValue]);

  const handleSearchFieldChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleExerciseSelection = (exercise) => {
    setSelectedExercise(exercise);
    setIsMobileDialogOpen(false);
  };

  const removeSnakeCase = (text) => {
    const removeUnderscore = text.split("_");
    const capitalizeAndAddSpace = removeUnderscore.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

    return capitalizeAndAddSpace;
  };

  const displayIsAlternatingInfo = () => {
    return selectedExercise.is_alternating === true ? "Yes" : "No";
  };

  const displayExerciseListItems = () => {
    if (filteredExerciseList.length > 0) {
      return (
        filteredExerciseList.map((exercise) => (
          <li key={exercise.id} className="search-panel__list-item">
            <Button 
              text={exercise.name}
              onClick={() => handleExerciseSelection(exercise)}
              mobileOnly={false}
            />
          </li>
        )));
    } else {
      return (
        <p className="search-panel__empty-list">No exercise matches</p>
      );
    }
  };

  const handleToggleMobileSearch = () => {
    setIsMobileDialogOpen(!isMobileDialogOpen);
  };

  const addSpaceAfterComma = (text) => {
    return text.split(",").join(", ");
  };

  const removeDoublePunctuation = () => {
    return selectedExercise.description.replace(/\.\.+/g, ".").replace(/\,\,+/g, ",");
  };

  return (
    <div className="App">
      <Button 
        text="Find an Exercise"
        onClick={handleToggleMobileSearch}
        mobileOnly={true}
      />
      <dialog className="mobile-dialog" open={isMobileDialogOpen}>
        <nav className="mobile-dialog__menu">
          <div className="mobile-dialog__search">
            <div className="mobile-dialog__close-wrap">
              <button
                className="mobile-dialog__close"
                onClick={handleToggleMobileSearch}
              >
                <span className="sr-only">Close</span>
              </button>
            </div>
            <SearchInput
              id="search_exercises"
              label="Search Exercises"
              value={searchValue}
              onChange={handleSearchFieldChange}
            />
          </div>
          <ul className="mobile-dialog__list">
            {displayExerciseListItems()}
          </ul>
        </nav>
      </dialog>
      <nav className="search-panel">
        <div className="search-panel__search">
          <SearchInput
            id="search_exercises"
            label="Search Exercises"
            value={searchValue}
            onChange={handleSearchFieldChange}
          />
        </div>
        <ul className="search-panel__list">
          {displayExerciseListItems()}
        </ul>
      </nav>
      <main className="details-panel">
        {errorMessage.length > 0 &&
          <div className="error-alert">Error: {errorMessage}</div>
        }
        {isExerciseSelected ?
          <section className="details-panel__section">
            <h1 className="details-panel__title">{selectedExercise.name}</h1>
            <div className="details-panel__level">{`Level ${selectedExerciseLevel}`}</div>
            <p className="details-panel__description">{removeDoublePunctuation()}</p>
            <div className="details-panel__video-wrap">
              <video className={`${selectedExercise.video.is_flipped ? "details-panel__flipped-video" : ""} details-panel__video`} src={selectedExercise.video.url} autoPlay muted loop>
                <source src={selectedExercise.video.url} type="video/mp4" />
                <source src={selectedExercise.video.url} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
            <details className="details-panel__accordion">
              <summary className="details-panel__accordion-summary">More Details for {selectedExercise.name}</summary>
              <div className="details-panel__accordion-content">
                <div className="details-panel__accordion-content-wrap">
                  {selectedExercise.muscle_groups &&
                    <TextDetails 
                      category="Muscle Groups"
                      value={addSpaceAfterComma(selectedExercise.muscle_groups)}
                    />
                  }
                  {selectedExercise.equipment_required &&
                    <TextDetails 
                      category="Equipment Required"
                      value={addSpaceAfterComma(selectedExercise.equipment_required)}
                    />
                  }
                  {selectedExercise.movement_patterns &&
                    <TextDetails 
                      category="Movement Patterns"
                      value={addSpaceAfterComma(selectedExercise.movement_patterns)}
                    />
                  }
                  {selectedExercise.synonyms &&
                    <TextDetails 
                      category="Synonyms"
                      value={addSpaceAfterComma(selectedExercise.synonyms)}
                    />
                  }
                  {selectedExercise.side &&
                    <TextDetails 
                      category="Side"
                      value={removeSnakeCase(selectedExercise.side)}
                    />
                  }
                  {selectedExercise.is_alternating &&
                    <TextDetails 
                      category="Is Alternating"
                      value={displayIsAlternatingInfo()}
                    />
                  }
                  {selectedExercise.audio &&
                    <audio controls src={selectedExercise.audio.url}>
                      <source src={selectedExercise.audio.url} type="audio/m4a" />
                      <source src={selectedExercise.audio.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  }
                </div>
              </div>
            </details>
          </section>
        :
          <p className="details-panel__empty-text">Select an exercise</p>
        }
      </main>
    </div>
  );
};

export default App;
