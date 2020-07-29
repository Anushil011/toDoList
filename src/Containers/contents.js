import React, { Component } from "react";
import _ from "lodash";

import ToDoItem from "../Components/toDoItem/toDoItem";
import axios from "../axios";

class Content extends Component {
  state = {
    id: null,
    title: "",
    contents: [],
    contentErr: false,
  };

  //get the item data from the database and update the state
  componentDidMount() {
    axios
      .get(this.props.history.location.pathname)
      .then((res) => {
        this.setState({
          id: res.data._id,
          title: res.data.title,
          contents: _.cloneDeep(res.data.items),
        });
      })
      .catch((err) => console.log(err));
  }

  // delete the todoItems and update the state
  toDoItemDeleteHandler = (id) => {
    let newContents = [];
    console.log("todo delete ");
    console.log(id);
    axios
      .post("/list/" + this.state.id + "/delete", { contentId: id })
      .then((res) => {
        console.log("ToDo item deleted");
        console.log(res);
      })
      .catch((err) => console.log(err));

    this.state.contents.map((content) =>
      content._id !== id ? newContents.push(content) : null
    );

    this.setState({ contents: newContents });
  };

  // add the todo items and update the state
  toDoItemAddHandler = (event, value) => {
    event.preventDefault();
    if (value) {
      axios
        .post("/list/" + this.state.id + "/add", { content: value })
        .then((res) => {
          console.log(res);
          axios
            .get(this.props.history.location.pathname)
            .then((res) => {
              console.log(res);
              this.setState({
                id: res.data._id,
                title: res.data.title,
                contents: _.cloneDeep(res.data.items),
                contentErr: false,
              });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      this.setState({ contentErr: true });
    }
  };

  render() {
    let toDoItem = null;
    //creating a separate component for each todo item
    toDoItem = this.state.contents.map((content) => (
      <ToDoItem
        key={content._id}
        id={content._id}
        toDoItem={content.content}
        toDoItemDeleteHandler={this.toDoItemDeleteHandler}
      />
    ));

    //form to input new todo items in a todolist
    let form = !this.state.contentErr ? (
      //this form for valid input
      <form
        id="inputForm"
        onSubmit={(event) => {
          const inputValue = document.getElementById("newToDoItem").value;
          this.toDoItemAddHandler(event, inputValue);
          const myForm = document.getElementById("inputForm");
          myForm.reset();
        }}
      >
        <input
          type="text"
          placeholder="To-Do"
          id="newToDoItem"
          style={{ margin: "5px 5px" }}
        />
        <button type="submit">+</button>
      </form>
    ) : (
      //this form for submitting empty input
      <form
        id="inputForm"
        onSubmit={(event) => {
          const inputValue = document.getElementById("newToDoItem").value;
          this.toDoItemAddHandler(event, inputValue);
          const myForm = document.getElementById("inputForm");
          myForm.reset();
        }}
      >
        <input
          type="text"
          placeholder="To-Do"
          id="newToDoItem"
          style={{ border: "2px solid red", margin: "5px 5px" }}
        />
        <button type="submit">+</button>
        <label style={{ color: "red", fontWeight: "bold", margin: "5px 5px" }}>
          {" "}
          {/**label for empty input */}
          Enter a value!!
        </label>
      </form>
    );
    return (
      <div>
        {toDoItem}
        {form}
      </div>
    );
  }
}

export default Content;
