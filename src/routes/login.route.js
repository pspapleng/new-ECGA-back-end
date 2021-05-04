const { Router } = require("express");

const {
  getAllLogin,
  getLogin,
  createLogin,
  deleteLogin,
} = require("../controllers/login.controller");
const loginRoute = Router();

loginRoute.get("/", getAllLogin);
loginRoute.get("/:id", getLogin); // n_id = id
loginRoute.post("/", createLogin);
loginRoute.delete("/:id", deleteLogin);

module.exports = loginRoute;
