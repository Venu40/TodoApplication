const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

// Define an array to hold the tasks

const tasks = [
  {
    key: 1,
    timestampCreated: "2021-09-01",
    title: "John Brown",
    description:
      "I am john brown, I am 32 years old, living in New York No. 1 Lake Park.",
    dueDate: "2023-09-01",
    tags: ["Tag1", "Tag2", "Tag3"],
    status: "open",
  },
  {
    key: 2,
    timestampCreated: "2022-03-01",
    title: "Jim Green",
    description:
      "I am Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
    dueDate: "2022-09-01",
    tags: ["Tag2", "Tag3"],
    status: "closed",
  },
  {
    key: 3,
    timestampCreated: "2020-03-04",
    title: "Joe Black",
    description:
      "I am Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.",
    dueDate: "2025-08-07",
    tags: ["Tag1", "Tag2", "Tag3"],
    status: "open",
  },
  {
    key: 4,
    timestampCreated: "2023-02-01",
    title: "John Brown",
    description:
      "I am john brown, I am 32 years old, living in New York No. 1 Lake Park.",
    dueDate: "2023-09-01",
    tags: ["Tag1", "Tag2", "Tag3"],
    status: "open",
  },
];

// Middleware to set the timestamp created on POST requests
app.use("/tasks", (req, res, next) => {
  if (req.method === "POST") {
    console.log(req.body);
    req.body.timestampCreated = new Date();
  }
  next();
});

// Define a route to get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Define a route to create a new task
app.post("/tasks", (req, res) => {
  let { title, description, dueDate, tags, timestampCreated } = req.body;

  console.log(req.body);
  // Validate the title and description fields
  if (!title || !description) {
    res
      .status(400)
      .json({ error: "Title and description are mandatory fields" });
    return;
  }

  // Set the default status to 'OPEN'
  const status = req.body.status || "OPEN";
  // dueDate = new Date(dueDate).slice(0, 10);
  // Add the new task to the tasks array
  const newTask = {
    title,
    description,
    dueDate,
    tags,
    status,
    timestampCreated,
  };
  tasks.push(newTask);

  res.json(tasks);
});

// Define a route to update an existing task
app.put("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const { title, description, dueDate, tags, status } = req.body;

  // Find the task with the given ID
  const taskToUpdate = tasks.find((task) => task.id === taskId);

  // Update the task fields
  if (title) taskToUpdate.title = title;
  if (description) taskToUpdate.description = description;
  if (dueDate) taskToUpdate.dueDate = dueDate;
  if (tags) taskToUpdate.tags = tags;
  if (status) taskToUpdate.status = status;

  res.json(taskToUpdate);
});

// Define a route to delete a task
app.delete("/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  // Remove the task with the given ID from the tasks array
  tasks = tasks.filter((task) => task.id !== taskId);

  res.json({ message: `Task ${taskId} deleted` });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
