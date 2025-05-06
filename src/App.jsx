import React, { useState } from "react";
import "./App.css";
import Ajout from "./components/ajout";
import Task from "./components/task";

function App() {
  // state
  const [task, setTask] = useState([]);

  const addTask = (newTask) => {
    setTask((prevTasks) => [...prevTasks, newTask]);
  };

  // suppression
  const deleteTask = (index) => {
    const updatetask = task.filter((task, taskIndex) => taskIndex !== index);
    setTask(updatetask);
  };
  // checkage
  const toggleCheck = ()=>{
    setTask(task)
  }
  return (
    <>
      <h1 className="text-center mx-auto text-6xl mt-14 uppercase font-semibold">
        to-do
      </h1>

      <Ajout addTask={addTask} />
      <Task tasks={task} deleteTask={deleteTask} toggleCheck={toggleCheck}/>
    </>
  );
}

export default App;
