import React, {useEffect, useState} from "react";
import './App.css';

import axios from 'axios';

// import SearchPanel from "./Components/SearchPanel"
// import DetailsPanel from "./Components/DetailsPanel"

function App() {
  const [exerciseList, setExerciseList] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [selectedExercise, setSelectedExercise] = useState({})
  const [isExerciseSelected, setIsExerciseSelected] = useState(false)
  const [selectedExerciseLevel, setSelectedExerciseLevel] = useState(null)

  const getExerciseList = () => {
    axios.get('https://candidate.staging.future.co/sandbox/api/exercises').then((exercises) => {
      setExerciseList(exercises.data)
    }).catch((e) => {
      console.log(e) // Add an error handling solution for this
    })
  }

  const getExerciseLevel = () => {
    axios.get(`https://candidate.staging.future.co/sandbox/api/exercises/${selectedExercise.id}/predictions`).then((prediction) => {
      setSelectedExerciseLevel(prediction.data.skill_level.level)
    }).catch((e) => {
      console.log(e) // Add an error handling solution for this
    })
  }

  useEffect(() => {
    getExerciseList()
  }, [])

  useEffect(() => {
    if (Object.keys(selectedExercise).length !== 0) {
      getExerciseLevel()
      setIsExerciseSelected(true)
    } else {
      setIsExerciseSelected(false)
    }
  }, [selectedExercise])

  const handleSearchFieldChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleExerciseSelection = (exercise) => {
    setSelectedExercise(exercise)
  }

  const displaySideInfo = () => {
    const removeUnderscore = selectedExercise.side.split("_")

    const capitalizeAndAddSpace = removeUnderscore.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")

    return capitalizeAndAddSpace
  }

  const displayIsAlternatingInfo = () => {
    return selectedExercise.is_alternating === true ? "Yes" : "No"
  }

// We either want to do a component for each whole panel and break it down further inside those for the different parts
// OR we want to keep the skeleton of each panel in here and then just have components for the various parts inside them
// like the video, search input, list, accordion/modal, chip, etc.

// TODO NEXT: Add styles and layout for better UI and UX - className="App-header"

  return (
    <div className="App">
      <aside className="search-panel">
        <div className="search-panel__search">
          <label htmlFor="search_exercises" className="search-panel__label">Search Exercises</label>
          <input
            type="search"
            id="search_exercises"
            name="search_exercises"
            value={searchValue}
            onChange={handleSearchFieldChange}
            className="search-panel__input"
          />
        </div>
        <ul className="search-panel__list">
          {/* TODO: Is there a way to make this better??? */}
          {exerciseList.filter((e) => e.name.toLowerCase().includes(searchValue.toLowerCase()) || searchValue === "").map((exercise) => (
            <li key={exercise.id} className="search-panel__list-item">
              <button onClick={() => handleExerciseSelection(exercise)} className="search-panel__button">{exercise.name}</button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="details-panel">
        {isExerciseSelected ?
          <section className="details-panel__section">
            <h1 className="details-panel__title">{selectedExercise.name}</h1>
            <div className="details-panel__level">{`Level ${selectedExerciseLevel}`}</div>
            <p className="details-panel__description">{selectedExercise.description}</p>
            <div className="details-panel__video-wrap">
              <iframe
                src={selectedExercise.video.url}
                referrerPolicy="strict-origin-when-cross-origin"
                title={`${selectedExercise.name} Video`}
                className="details-panel__video"
              />
            </div>
            <details className="details-panel__accordion">
              <summary className="details-panel__accordion-summary">More {selectedExercise.name} Details</summary>
              <div className="details-panel__accordion-content">
                <div className="details-panel__accordion-content-wrap">
                  {selectedExercise.muscle_groups &&
                    <p><span className="details-panel__bold-text">Muscle Groups:</span> {selectedExercise.muscle_groups}</p>
                  }
                  {selectedExercise.equipment_required &&
                    <p><span className="details-panel__bold-text">Equipment Required:</span> {selectedExercise.equipment_required}</p>
                  }
                  {selectedExercise.movement_patterns &&
                    <p><span className="details-panel__bold-text">Movement Patterns:</span> {selectedExercise.movement_patterns}</p>
                  }
                  {selectedExercise.synonyms &&
                    <p><span className="details-panel__bold-text">Synonyms:</span> {selectedExercise.synonyms}</p>
                  }
                  {selectedExercise.side &&
                    <p><span className="details-panel__bold-text">Side:</span> {displaySideInfo()}</p>
                  }
                  {selectedExercise.is_alternating &&
                    <p><span className="details-panel__bold-text">Is Alternating:</span> {displayIsAlternatingInfo()}</p>
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
}

export default App;
