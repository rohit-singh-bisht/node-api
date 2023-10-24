const express = require("express");
const app = express();
const port = 9000;
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
