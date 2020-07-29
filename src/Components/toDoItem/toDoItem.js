import React from "react";

const toDoItem = (props) => {
  return (
    <div>
      {/** checkbox */}
      <div style={{ display: "inline-block", margin: "5px 4px" }}>
        <input
          type="checkbox"
          onChange={() => props.toDoItemDeleteHandler(props.id)}
          name="checkbox"
          value={props.id}
        />
      </div>
      {/** display the content of todolist */}
      <div style={{ display: "inline-block" }}>{props.toDoItem}</div>{" "}
    </div>
  );
};

export default toDoItem;
