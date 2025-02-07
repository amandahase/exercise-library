import React, {useEffect, useState} from "react";
import './App.css';

import axios from 'axios';

// import SearchPanel from "./Components/SearchPanel"
// import DetailsPanel from "./Components/DetailsPanel"
// https://candidate.staging.future.co/sandbox/api/exercises
// https://candidate.staging.future.co/sandbox/api/exercises/:excercise_id/predictions - ML

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
  // Every time the selected exercise changes, we need to call to the ML API to get the level that matches that exercise's id value

  const handleSearchFieldChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleExerciseSelection = (exercise) => {
    setSelectedExercise(exercise)
  }

// We either want to do a component for each whole panel and break it down further inside those for the different parts
// OR we want to keep the skeleton of each panel in here and then just have components for the various parts inside them
// like the video, search input, list, accordion/modal, chip, etc.

// TODO NEXT: Use Axios to fetch ML list from API endpoint
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
            <iframe
              src={selectedExercise.video.url}
              referrerPolicy="strict-origin-when-cross-origin"
              title={`${selectedExercise.name} Video`}
              className="details-panel__video"
            />
            <details className="details-panel__accordion">
              <summary className="details-panel__accordion-summary">More {selectedExercise.name} Details</summary>
              <div className="details-panel__accordion-content">
                {selectedExercise.muscle_groups &&
                  <p>Muscle Groups: {selectedExercise.muscle_groups}</p>
                }
                {selectedExercise.equipment_required &&
                  <p>Equipment Required: {selectedExercise.equipment_required}</p>
                }
                {selectedExercise.movement_patterns &&
                  <p>Movement Patterns: {selectedExercise.movement_patterns}</p>
                }
                {selectedExercise.synonyms &&
                  <p>Synonyms: {selectedExercise.synonyms}</p>
                }
                {selectedExercise.side &&
                  <p>Side: {selectedExercise.side}</p> // right_side show right or left chip instead of value
                }
                {selectedExercise.is_alternating && // true/false, so show a chip or something here instead of value
                  <p>Is Alternating: {selectedExercise.is_alternating}</p>
                }
                {selectedExercise.audio &&
                  <audio controls src={selectedExercise.audio.url}>
                    <source src={selectedExercise.audio.url} type="audio/m4a" />
                    <source src={selectedExercise.audio.url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                }
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
