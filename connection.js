const mongoose = require("mongoose");

function connectToDb(dbUrl) {
  mongoose
    .connect(dbUrl)
    .then((data) => console.log("Connected to database"))
    .catch((err) => console.log("Can't connect to database", err));

  const db = mongoose.connection;
  db.on("connected", () => {
    console.log("MongoDB connection is open");
  });

  db.on("error", (err) => {
    console.error("MongoDB connection error: " + err);
  });

  db.on("disconnected", () => {
    console.log("MongoDB connection is disconnected");
  });

  return db;
}

module.exports = connectToDb;
