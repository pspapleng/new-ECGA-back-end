const { Router } = require("express");
const route = Router();
const testRoute = require("./test.route");
const usersRoute = require("./users.route");
const nurseRoute = require("./nurse.route");

route.use("/test", testRoute);
route.use("/users", usersRoute);
route.use("/nurse", nurseRoute);

module.exports = route;
