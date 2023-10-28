const express = require("express");
const router = express.Router();
const { Users } = require("../models/users");

router.get("/", async (req, res) => {
  const userList = await Users.find({});
  return res.json(userList);
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await Users.findById(userId);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userFound = Users.findById(userId);
    if (!userFound) {
      return res.send("User not found to delete");
    }

    const result = await Users.findByIdAndDelete(userId);
    if (!result) return res.status(404).json({ msg: "Can't delete user" });

    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user");
    return res.status(500).send("Internal server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, gender, job_title } = req.body;

    if (!first_name || !last_name || !email || !gender || !job_title) {
      return res.status(400).json({
        error:
          "First name, last name, email, gender, and job title are required",
      });
    }

    // Check if the email already exists in the database
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const result = await Users.create({
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

router.patch("/:id", async (req, res) => {
  const userId = req.params.id;
  const body = req.body;
  console.log(body);
  const result = await Users.findByIdAndUpdate(userId, { body });
  if (!result) {
    return res.status(400).json({ msg: "Can't update user profile" });
  }
  return res.status(200).json({ msg: "User updated successfully" });
});

module.exports = router;
