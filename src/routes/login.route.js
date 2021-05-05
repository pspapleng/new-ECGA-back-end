const { Router } = require("express");
const { isLoggedIn } = require("../middlewares");

const {
  getAllLogin,
  getLogin,
  createLogin,
  whoLogin,
  deleteLogin,
} = require("../controllers/login.controller");
const loginRoute = Router();

loginRoute.get("/", getAllLogin);
loginRoute.get("/:id", getLogin); // n_id = id
loginRoute.post("/", createLogin);
loginRoute.get("/user/me", isLoggedIn, whoLogin); //who login
loginRoute.delete("/:id", deleteLogin); // n_id = id

module.exports = loginRoute;
