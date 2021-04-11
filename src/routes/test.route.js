const { Router } = require("express");
const { getAll } = require("../controllers/test.controller");
const testRoute = Router();

testRoute.get("/", getAll);
module.exports = testRoute;
