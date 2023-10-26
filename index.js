const express = require("express");
const app = express();
const port = 9000;
const fs = require("fs");
const users = require("./MOCK_DATA.json");

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

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const userData = users?.find((user) => user?.id === userId);
  return res.json(userData);
});

app.delete("/api/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const userFound = users?.find((user) => user?.id === userId);
  if (!userFound) {
    return res.send("User not found to delete");
  }
  const userList = users.filter((user) => user?.id !== userId);
  fs.writeFile("MOCK_DATA.json", JSON.stringify(userList), (err, data) => {
    if (err) {
      return console.log("Can't delete user successfully");
    }
    return res.status(200).send("User Deleted Successfully");
  });
});

app.post("/api/users", (req, res) => {
  const { first_name, last_name, email, gender, job_title } = req.body;
  if (!first_name || !last_name || !email || !gender || !job_title)
    return res
      .status(404)
      .send("First name, last name, email, gender and job title are required");
  const emailExist = users.find((user) => user?.email === email);
  if (emailExist)
    return res
      .status(404)
      .send("Email already exist. Please try with another email");
  const copiedUsersArray = [...users];
  const userBody = {
    id: Math.max(...copiedUsersArray?.map((users) => users?.id)) + 1,
    first_name,
    last_name,
    email,
    gender,
    job_title,
  };
  const updatedUserArray = [...copiedUsersArray, userBody];
  fs.writeFile(
    "MOCK_DATA.json",
    JSON.stringify(updatedUserArray),
    (err, data) => {
      if (err) {
        console.log("err", err);
        return res.status(400).send("Error adding user.");
      }
      res.status(200).send("User added successfully");
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
