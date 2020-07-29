import React from "react";
import { Route } from "react-router-dom";

import Contents from "./Containers/contents";
import "./App.css";
import ToDoList from "./Containers/toDoList";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={ToDoList} />
      <Route path="/list/:id" component={Contents} />
    </div>
  );
}

export default App;
