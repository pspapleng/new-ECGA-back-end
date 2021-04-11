const { Router } = require("express");
const route = Router();
const testRoute = require("./test.route");
const patientlistRoute = require("./patientlist.route");

route.use("/test", testRoute);
route.use("/patientlist", patientlistRoute);

module.exports = route;
