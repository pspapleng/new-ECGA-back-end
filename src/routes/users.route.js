const { Router } = require("express");
const { isLoggedIn } = require("../middlewares");

const {
  getAllUsers,
  getUsersByUid,
  createUsers,
  updateUsers,
  deleteUsers,
} = require("../controllers/users.controller");
const usersRoute = Router();

usersRoute.get("/", isLoggedIn, getAllUsers);
usersRoute.get("/:id", isLoggedIn, getUsersByUid);
usersRoute.post("/", isLoggedIn, createUsers);
usersRoute.put("/:id", isLoggedIn, updateUsers);
usersRoute.delete("/:id", isLoggedIn, deleteUsers);

module.exports = usersRoute;
