const { Router } = require("express");
const { isLoggedIn } = require("../middlewares");

const route = Router();
const usersRoute = require("./users.route");
const nurseRoute = require("./nurse.route");
const resultRoute = require("./result.route");
const ansRoute = require("./ans.route");
const loginRoute = require("./login.route");

route.use("/users", isLoggedIn, usersRoute);
route.use("/nurse", nurseRoute);
route.use("/result", isLoggedIn, resultRoute);
route.use("/ans", isLoggedIn, ansRoute);
route.use("/login", loginRoute);

module.exports = route;
