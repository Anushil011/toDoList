import React, { Component } from "react";
import _ from "lodash";

import Preview from "../Components/preview/preview";
import axios from "../axios";

class ToDoList extends Component {
  state = {
    lists: [
      {
        id: 1,
        title: "Add a List",
        content: [],
      },
    ],
    formDisplay: false,
  };

  //get the todolists from the database and update the state
  componentDidMount() {
    console.log("component did mount");
    axios
      .get("/")
      .then((res) => {
        const todolists = [];
        todolists.push(_.cloneDeep(this.state.lists[0]));

        res.data.map((
          //set the local lists array in the
          item
        ) =>
          todolists.push({
            title: item.title,
            id: item._id,
            content: _.cloneDeep(item.items),
          })
        );
        this.setState({ lists: todolists });
        console.log(this.state.lists);
      })
      .catch((err) => console.log(err));
  }

  //display the add-todolist form
  formDisplayHandler = () => {
    this.setState({ formDisplay: true });
  };

  //add a new todolist
  addToDoListAddHandler = (event, title) => {
    event.preventDefault();

    /***********create a new todo item *********/

    axios
      .post("/", { title: title })
      .then((res) => {
        axios
          .get("/")
          .then((res) => {
            const todolists = [];
            todolists.push(_.cloneDeep(this.state.lists[0]));

            res.data.map((item) =>
              todolists.push({
                title: item.title,
                id: item._id,
                content: _.cloneDeep(item.items),
              })
            );
            this.setState({ lists: todolists, formDisplay: false });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  // delete the todolist
  deleteHandler = (id) => {
    console.log("deletehandler");
    axios
      .post("/delete", { id: id })
      .then((res) => console.log("ToDOList deleted"))
      .catch((err) => console.log(err));
    //const updatedList = JSON.parse(JSON.stringify(this.state.lists));
    const updatedList = [];
    this.state.lists.map((item) =>
      item.id !== id ? updatedList.push(item) : null
    );
    this.setState({ lists: updatedList });
  };

  render() {
    return (
      <Preview
        data={this.state.lists}
        formDisplayHandler={this.formDisplayHandler}
        deleteHandler={this.deleteHandler}
        formDisplay={this.state.formDisplay}
        addToDoListAddHandler={this.addToDoListAddHandler}
      />
    );
  }
}

export default ToDoList;
