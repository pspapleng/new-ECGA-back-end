const { Router } = require("express");
const { getNamelist } = require("../controllers/patientlist.controller");
const patientlistRoute = Router();

patientlistRoute.get("/", getNamelist);
module.exports = patientlistRoute;
