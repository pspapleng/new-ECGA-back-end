const { config } = require("../configs/pg.config");

async function logger(req, res, next) {
  const timestamp = new Date().toISOString().substring(0, 19);
  console.log(`${timestamp} | ${req.method}: ${req.originalUrl}`);
  next();
}

async function isLoggedIn(req, res, next) {
  console.log(req.headers.authorization);
  let authorization = req.headers.authorization;
  console.log("auth", authorization);
  if (!authorization) {
    return res.status(401).send("You are not logged in");
  }

  let [part1, part2] = authorization.split(" ");
  if (part1 !== "Bearer" || !part2) {
    return res.status(401).send("You are not logged in");
  }

  // Check token
  const [
    tokens,
  ] = await config.query("SELECT * FROM login_system WHERE refresh_token = ?", [
    part2,
  ]);
  const token = tokens[0];
  console.log("token", tokens);
  if (!token) {
    return res.status(401).send("You are not logged in");
  }

  // Set user
  const [
    users,
  ] = await config.query(
    "SELECT n_id, ID, n_fname, n_lname, username FROM nurse WHERE n_id = ?",
    [token.n_id]
  );
  req.user = users[0];
  // console.log("User", users[0]);
  next();
}

module.exports = {
  logger,
  isLoggedIn,
};
