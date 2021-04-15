const { Router } = require("express");
const {
  getNurse,
  createNurse,
  updateNurse
} = require("../controllers/nurse.controller");
const nurseRoute = Router();

nurseRoute.get("/", getNurse);
nurseRoute.post("/", createNurse);
nurseRoute.put("/:id", updateNurse);
module.exports = nurseRoute;
