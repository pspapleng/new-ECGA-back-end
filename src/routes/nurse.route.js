const { Router } = require("express");
const { isLoggedIn } = require("../middlewares");

const {
  getAllNurse,
  getNurse,
  createNurse,
  updateNurse,
} = require("../controllers/nurse.controller");
const nurseRoute = Router();

nurseRoute.get("/", getAllNurse);
nurseRoute.get("/:id", getNurse);
nurseRoute.post("/", createNurse);
nurseRoute.put("/:id", isLoggedIn, updateNurse);

module.exports = nurseRoute;
