const { Router } = require("express");

const route = Router();
const usersRoute = require("./users.route");
const nurseRoute = require("./nurse.route");
const resultRoute = require("./result.route");
const ansRoute = require("./ans.route");
const loginRoute = require("./login.route");

route.use("/users", usersRoute);
route.use("/nurse", nurseRoute);
route.use("/result", resultRoute);
route.use("/ans", ansRoute);
route.use("/login", loginRoute);

module.exports = route;
