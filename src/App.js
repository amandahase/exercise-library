import { stubFalse } from "lodash";
import React, {useEffect, useState} from "react";
import './App.css';
// import SearchPanel from "./Components/SearchPanel"
// import DetailsPanel from "./Components/DetailsPanel"

const exercises = [
  {
    id: 1,
    name: "Bench Press",
    description: "Upper body lift that can be done with a barbell or dumbells.",
    video_url: "https://www.youtube.com/embed/SCVCLChPQFY?si=w3Abwp3pplVyptqp"
  },
  {
    id: 2,
    name: "Back Squat",
    description: "Lower body lift that is done with a barbell.",
    video_url: "https://www.youtube.com/embed/QmZAiBqPvZw?si=nddq-dAKSZs6KW1o"
  },
  {
    id: 3,
    name: "Front Squat",
    description: "Lower body lift that is done with a barbell.",
    video_url: "https://www.youtube.com/embed/uYumuL_G_V0?si=O5SOBFnMTVn8W-Cm"
  },
  {
    id: 4,
    name: "Deadlift",
    description: "Lower body exercise that can be done with a barbell, kettlebells, or dumbells.",
    video_url: "https://www.youtube.com/embed/1ZXobu7JvvE?si=wQi8221_ug3ooqna"
  },
  {
    id: 5,
    name: "Push Press",
    description: "Upper body exercise that can be done with a barbell, kettlebells, or dumbells.",
    video_url: "https://www.youtube.com/embed/iaBVSJm78ko?si=AK_VLJClGtBbMxS0"
  },
]

function App() {
  const [exerciseList, setExerciseList] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [selectedExercise, setSelectedExercise] = useState({})
  const [isExerciseSelected, setIsExerciseSelected] = useState(false)

  useEffect(() => {
    setExerciseList(exercises)
  }, [])

  useEffect(() => {
    const filteredExerciseList = exercises.filter((e) => e.name.toLowerCase().includes(searchValue.toLowerCase()) || searchValue === "")

    setExerciseList(filteredExerciseList)
  }, [searchValue])

  useEffect(() => {
    if (Object.keys(selectedExercise).length !== 0) {
      setIsExerciseSelected(true)
    } else {
      setIsExerciseSelected(stubFalse)
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

  return (
    <div className="App"> {/** This needs to be a grid layout */}
      <header className="App-header">

      </header>
      <aside>
        <label htmlFor="search_exercises">Search Exercises</label>
        <input
          type="text"
          id="search_exercises"
          name="search_exercises"
          value={searchValue}
          onChange={handleSearchFieldChange}
        />
        <ul>
          {exerciseList.map((exercise) => (
            <li key={exercise.id}>
              <button onClick={() => handleExerciseSelection(exercise)}>{exercise.name}</button>
            </li>
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
        {isExerciseSelected ?
          <section>
            <h1>{selectedExercise.name}</h1>
            {/* <div></div> */}
            <p>{selectedExercise.description}</p>
            <iframe width="560" height="315" 
              src={selectedExercise.video_url}
              referrerPolicy="strict-origin-when-cross-origin"
            >
            </iframe>
          </section>
        :
          <p>Select an exercise</p>
        }
      </main>
    </div>
  );
}

export default App;
