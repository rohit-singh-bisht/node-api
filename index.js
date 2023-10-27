const express = require("express");
const app = express();
const port = 9000;
const fs = require("fs");
const mongoose = require("mongoose");
// const users = require("./MOCK_DATA.json");

mongoose
  .connect("mongodb://127.0.0.1:27017/node-project-db")
  .then((data) => console.log("Connected to database"))
  .catch((err) => console.log("Can't connect to database", err));

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection is open");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection is disconnected");
});

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    gender: {
      type: String,
      require: true,
    },
    job_title: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const users = mongoose.model("user", userSchema);

// Body parsing middleware (for JSON and URL-encoded data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to write log files as per my needs.
app.use((req, res, next) => {
  const userIP = req.ip;
  const reqURL = req.url;
  const logData = `${new Date(Date.now()).toLocaleString()}, IP: ${userIP}, ${
    req.method
  } ${reqURL}\n`;
  fs.appendFile("log.txt", logData, (err, data) => {
    if (err) return res.json("Error writing log file.");
    next();
  });
});

app.get("/users", (req, res) => {});

app.get("/api/users", async (req, res) => {
  const userList = await users.find({});
  return res.json(userList);
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await users.findById(userId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userFound = users.findById(userId);
    if (!userFound) {
      return res.send("User not found to delete");
    }

    const result = await users.findByIdAndDelete(userId);
    if (!result) return res.status(404).json({ msg: "Can't delete user" });

    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user");
    return res.status(500).send("Internal server error");
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { first_name, last_name, email, gender, job_title } = req.body;

    if (!first_name || !last_name || !email || !gender || !job_title) {
      return res.status(400).json({
        error:
          "First name, last name, email, gender, and job title are required",
      });
    }

    // Check if the email already exists in the database
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const result = await users.create({
      first_name,
      last_name,
      email,
      gender,
      job_title,
    });

    console.log("User created successfully:", result);
    return res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
