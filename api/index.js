require("dotenv").config({ path: '../.env' }); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// Models
const Todo = require("./models/Todo");

const app = express();

app.use(express.json());
const corsOptions = {
  origin: process.env.REACT_APP_API_URL, // Replace with your actual frontend URL
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000,
    poolSize:10,
    family:4
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.get("/test", (req, res) => {
  res.json("welcome");
});

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();

  res.json(todos);
});

app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save();

  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);

  res.json({ result });
});

app.get("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
});

app.put("/todo/update/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.text = req.body.text;

  todo.save();

  res.json(todo);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port 3001");
  console.log("MONGO_URI:", process.env.MONGO_URI);
  console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
});
