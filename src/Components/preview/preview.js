import React from "react";

import Item from "../item/listItem";
import classes from "./preview.module.css";
const preview = (props) => {
  let items = null;

  items = props.data.map((item, index) => {
    // "Add a todolist" item doesnot have delete button
    let itemWithDelete = (
      <Item
        key={index}
        data={item}
        formDisplayHandler={props.formDisplayHandler}
        formDisplay={props.formDisplay}
        addToDoListAddHandler={props.addToDoListAddHandler}
      />
    );

    //rest of the todolists have delete button
    if (item.title !== "Add a List")
      itemWithDelete = (
        <div key={index} style={{ margin: "20px 0" }}>
          <div>
            <Item
              data={item}
              formDisplayHandler={props.formDisplayHandler}
              formDisplay={props.formDisplay}
              addToDoListAddHandler={props.addToDoListAddHandler}
            />
          </div>

          {/** delete button */}
          <button
            onClick={() => props.deleteHandler(item.id)}
            style={{ width: "200px" }}
          >
            Delete
          </button>
        </div>
      );
    return itemWithDelete;
  });

  return <div className={classes.preview}>{items}</div>;
};
export default preview;
