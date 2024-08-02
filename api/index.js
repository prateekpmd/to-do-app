require("dotenv").config({ path: "../.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models
const Todo = require("./models/Todo");

const app = express();

app.use(express.json());
const corsOptions = {
  origin:[process.env.FRONTEND_URL], // Replace with your actual frontend URL
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  methods: 'GET,POST,PUT,DELETE', // Specify allowed methods as needed
   credentials: true, // If your frontend needs to send cookies or credentials with the request
   allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000,
    poolSize: 10,
    family: 4,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.get("/", (req, res) => {
  res.json("welcome");
});


  app.get("/todos", async (req, res) => {
    try {
      const todos = await Todo.find();
      console.log(todos);
      res.json(todos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });


app.post("/todo/new", async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
    });

    todo
      .save()
      .then(() => res.json(todo))
      .catch((err) => res.status(400).json(err));
  } catch (error) {
    res.status(500).json({ message: "Couldnt Add New Todo" });
  }
});

app.delete("/todo/delete/:id", async (req, res) => {
  try { 
    const result = await Todo.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/todo/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.complete = !todo.complete;

    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/todo/update/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.text = req.body.text;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
