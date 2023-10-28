const express = require("express");
const app = express();
const port = 9000;
const connectToDb = require("./connection");
const userRoutes = require("./routes/users");
const logReqRes = require("./middlewares/logData");

// connect to db
connectToDb("mongodb://127.0.0.1:27017/node-project-db");

// Body parsing middleware (for JSON and URL-encoded data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to write log files as per my needs.
app.use(logReqRes("log.txt"));

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
