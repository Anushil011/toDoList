import React from "react";
import { withRouter } from "react-router-dom";

import classes from "./listItem.module.css";

const listItem = (props) => {
  //add new todolist
  let itemAccess = null;
  if (props.data.title === "Add a List") {
    // toggle from display
    itemAccess = props.formDisplay ? (
      <div>
        <div onClick={props.formDisplayHandler}>{props.data.title}</div>

        {/*** submitting this form creates new todolist****/}
        <form
          onSubmit={(event) => {
            const input = document.getElementById("listTitle").value; //get the input title value from the input tag
            props.addToDoListAddHandler(event, input);
          }}
        >
          <input id="listTitle" type="text" placeholder="To-Do-List Title" />
          <button type="submit">Submit</button>
        </form>
      </div>
    ) : (
      <div onClick={props.formDisplayHandler}>{props.data.title}</div> // Add new item component
    );
  } else {
    itemAccess = (
      // clicking this todolist gives access to the todo items in the list
      <div
        onClick={() => {
          props.history.push("/list/" + props.data.id);
        }}
      >
        {props.data.title}
      </div>
    );
  }

  return <div className={classes.listItem}>{itemAccess}</div>;
};

export default withRouter(listItem);
