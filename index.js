const express = require("express");
const app = express();
const port = 9000;
const fs = require("fs");
const users = require("./MOCK_DATA.json");

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
