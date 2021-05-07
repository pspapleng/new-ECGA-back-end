const { config } = require("../configs/pg.config");
const loginSchema = require("../schema/login.schema");
const bcrypt = require("bcrypt");

//generate token
function generateToken() {
  const result = [];
  const characters =
    "*/=-$#!@^&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 100; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * characters.length))
    );
  }
  return result.join("");
}

async function getAllLogin(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT ls.*, n.n_id, n.ID, n.n_fname, n.n_lname FROM login_system ls JOIN nurse n on (ls.n_id = n.n_id)"
    );
    let result = rows;
    await conn.commit();
    return res.send(result);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function getLogin(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT ls.*, n.n_id, n.ID, n.n_fname, n.n_lname FROM login_system ls JOIN nurse n on (ls.n_id = n.n_id) WHERE n_id = ?",
      req.params.id
    );
    let result = rows[0];
    await conn.commit();
    return res.send(result);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function createLogin(req, res, next) {
  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false });
  } catch (err) {
    return res.status(400).send(err);
  }
  const username = req.body.username;
  const password = req.body.password;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    // Check if username is correct
    const [nurse] = await conn.query("SELECT * FROM nurse WHERE username=?", [
      username,
    ]);
    const who = nurse[0];
    if (!who) {
      throw new Error("Incorrect username or password");
    }

    // Check if password is correct
    if (!(await bcrypt.compare(password, who.password))) {
      throw new Error("Incorrect username or password");
    }

    // Check if token already existed
    const [tokens] = await conn.query(
      "SELECT * FROM login_system WHERE n_id=?",
      [who.n_id]
    );
    // console.log(tokens);
    let token = !!tokens[0];
    if (!token) {
      // Generate and save token into database
      token = generateToken();
      let today = new Date();
      let expired = new Date();
      expired.setDate(today.getDate() + 7);
      await conn.query(
        "INSERT INTO login_system(refresh_token, ExpiresAt, n_id) VALUES (?, ?, ?)",
        [token, expired, who.n_id]
      );
      conn.commit();
      res.status(200).json({ message: "login complete!", token: token });
    } else {
      conn.commit();
      res.status(200).json({ token: tokens[0].token });
    }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err.toString());
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function whoLogin(req, res, next) {
  res.json(req.user);
}

async function deleteLogin(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    await conn.query("DELETE from login_system WHERE n_id = ?;", [
      req.params.id,
    ]);
    await conn.commit();
    return res.send("n_id : " + req.params.id + " logout complete!");
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

module.exports = {
  getAllLogin,
  getLogin,
  createLogin,
  whoLogin,
  deleteLogin,
};
