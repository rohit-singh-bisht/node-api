const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserByID,
  deleteUserById,
  createUser,
  updateUser,
} = require("../controllers/users");

router.get("/", getAllUsers);

router.route("/:id").get(getUserByID).delete(deleteUserById).patch(updateUser);

router.post("/", createUser);

module.exports = router;
