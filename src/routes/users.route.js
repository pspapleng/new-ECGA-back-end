const { Router } = require("express");
const {
  getUsers,
  createUsers,
  updateUsers,
  deleteUser
} = require("../controllers/users.controller");
const usersRoute = Router();

usersRoute.get("/", getUsers);
usersRoute.post("/", createUsers);
usersRoute.put("/:id", updateUsers);
usersRoute.delete("/:id", deleteUser);
module.exports = usersRoute;
