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

  const getExerciseList = () => {
    axios.get('https://candidate.staging.future.co/sandbox/api/exercises').then((exercises) => {
      setExerciseList(exercises.data)
    }).catch((e) => {
      console.log(e)
    })
  }

  useEffect(() => {
    getExerciseList()
  }, [])

  useEffect(() => {
    if (Object.keys(selectedExercise).length !== 0) {
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

// We either want to do a component for each whole panel and break it down further inside those for the different parts
// OR we want to keep the skeleton of each panel in here and then just have components for the various parts inside them
// like the video, search input, list, accordion/modal, chip, etc.

// TODO NEXT: Use Axios to fetch ML list from API endpoint
// TODO NEXT: Add styles and layout for better UI and UX - className="App-header"

  return (
    <div className="App"> {/** This needs to be a grid layout */}
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
            <div className="details-panel__level">Intermediate</div>
            <p className="details-panel__description">{selectedExercise.description}</p>
            <iframe
              src={selectedExercise.video_url}
              referrerPolicy="strict-origin-when-cross-origin"
              title={`${selectedExercise.name} Video`}
              className="details-panel__video"
            />
            <details className="details-panel__accordion">
              <summary className="details-panel__accordion-summary">More {selectedExercise.name} Details</summary>
              <p className="details-panel__accordion-content">Here is the content!</p>
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
