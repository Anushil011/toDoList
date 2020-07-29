const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/******************* connect to mongoose atlas ************************/

mongoose.connect("mongodb://localhost:27017/toDoListsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDb database connection is established successfully");
});

/******************* create database schema ************************/

const itemsSchema = {
  content: String,
};

const Item = mongoose.model("Item", itemsSchema);

const ListSchema = {
  title: { type: String, required: true },
  items: [itemsSchema],
};
const List = mongoose.model("List", ListSchema);

/********* initial items ****************/
const item1 = new Item({
  content: "Welcome to you todoList!",
});
const item2 = new Item({
  content: "Hit the + button to add a new item.",
});
const item3 = new Item({
  content: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

/************************************ routing section ************************************/

/************************ get route **********************/
app.get("/", (req, res) => {
  List.find()
    .then((lists) => {
      if (lists.length < 1) {
        res.json("No items found");
      }
      res.json(lists);
    })
    .catch((err) => console.log(err));
});

/************************ post route **********************/
app.post("/", (req, res) => {
  console.log("post router");
  console.log(req.body);
  const newtitle = req.body.title;
  const newTodolist = new List({ title: newtitle, items: defaultItems });

  newTodolist
    .save()
    .then((result) => {
      res.json({ message: "New todolist added", createdProduct: result });
    })
    .catch((err) => console.log(err));
});

/************************ delete todolist route **********************/
app.post("/delete", (req, res) => {
  List.findByIdAndDelete(req.body.id)
    .then((result) =>
      res.json({ message: "Todolist deleted", product: result })
    )
    .catch((err) => {
      res.json(err);
      console.log(err);
    });
});

/************************ get a todolist route **********************/
app.get("/list/:id", (req, res) => {
  const id = req.params.id;
  List.findById(id)
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

/************************ add a content route **********************/
app.post("/list/:id/add", (req, res) => {
  const newContent = new Item({ content: req.body.content });

  /************ get the array contents **************/
  List.findById(req.params.id)
    .select("items")
    .then((result) => {
      /************ update the array contents **************/
      List.findByIdAndUpdate(
        req.params.id,
        {
          items: [...result.items, newContent],
        },
        { new: true, useFindAndModify: false }
      )
        .then((result) =>
          res.json({ message: "new content posted", product: result })
        )
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      res.json(err);
      console.log(err);
    });
});

/************************ delete a content route **********************/
app.post("/list/:id/delete", (req, res) => {
  /************ get the array contents **************/
  List.findById(req.params.id)
    .select("items")
    .then((result) => {
      let updateArray = [];
      result.items.map((content) => {
        if (content._id != req.body.contentId) {
          updateArray.push(content);
        }
      });

      /************ update the array contents **************/

      List.findByIdAndUpdate(
        req.params.id,
        { items: updateArray },
        { new: true, useFindAndModify: false }
      )
        .then((result) =>
          res.json({ message: "Item deleted", product: result })
        )
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).json(err));
});

/// listen to server
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
