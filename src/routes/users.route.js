const { Router } = require("express");
const {
  getAllUsers,
  getUsers,
  createUsers,
  updateUsers,
  deleteUsers
} = require("../controllers/users.controller");
const usersRoute = Router();

usersRoute.get("/", getAllUsers);
usersRoute.get("/:id", getUsers);
usersRoute.post("/", createUsers);
usersRoute.put("/:id", updateUsers);
usersRoute.delete("/:id", deleteUsers);

module.exports = usersRoute;
