import React, {useEffect, useState} from "react";
import './App.css';
// import SearchPanel from "./Components/SearchPanel"
// import DetailsPanel from "./Components/DetailsPanel"

const exercises = [
  {
    id: 1,
    name: "Bench Press",
    description: "Upper body lift that can be done with a barbell or dumbells."
  },
  {
    id: 2,
    name: "Back Squat",
    description: "Lower body lift that is done with a barbell."
  },
  {
    id: 3,
    name: "Front Squat",
    description: "Lower body lift that is done with a barbell."
  },
  {
    id: 4,
    name: "Plank",
    description: "Core exercise that can be done as a body weight exercise or with weight on your back."
  },
  {
    id: 5,
    name: "Push Press",
    description: "Upper body exercise that can be done with a barbell, kettlebells, or dumbells."
  },
]

function App() {
  const [exerciseList, setExerciseList] = useState([])
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    setExerciseList(exercises)
  }, [])

  const handleSearchFieldChange = (e) => {
    setSearchValue(e.target.value)
  }

  useEffect(() => {
    const filteredExerciseList = exercises.filter((e) => e.name.toLowerCase().includes(searchValue.toLowerCase()) || searchValue === "")

    setExerciseList(filteredExerciseList)
  }, [searchValue])

// We either want to do a component for each whole panel and break it down further inside those for the different parts
// OR we want to keep the skeleton of each panel in here and then just have components for the various parts inside them
// like the video, search input, list, accordion/modal, chip, etc.

  return (
    <div className="App"> {/** This needs to be a grid layout */}
      <header className="App-header">

      </header>
      <aside>
        <label for="search_exercises">Search Exercises</label>
        <input
          type="text"
          id="search_exercises"
          name="search_exercises"
          value={searchValue}
          onChange={handleSearchFieldChange}
        />
        <ul>
          {exerciseList.map((exercise) => (
            <li key={exercise.id}>{exercise.name}</li>
          ))}
        </ul>
      </aside>
      <main>
        {/* 
          Right panel with details displayed

          <h1></h1>
          <div></div> --> requesite exercise level chip
          <p></p>
          <video></video>
          either an daccordion or a modal popup for MORE DETAILS section
        */}
      </main>
    </div>
  );
}

export default App;
