const { config } = require("../configs/pg.config");

async function getAllLogin(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM login_system LEFT JOIN nurse USING (n_id)"
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
      "SELECT * FROM login_system LEFT JOIN nurse USING (n_id) WHERE n_id = ?",
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
  const username = req.body.username;
  const password = req.body.password;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM nurse WHERE username = ? and password = ?",
      username,
      password
    );
    let result = rows[0];
    if (result !== null) {
      await conn.query(
        "INSERT INTO login_system (refresh_token, ExpiresAt, n_id) VALUES (?, ?, ?);",
        [refresh_token, ExpiresAt, result.n_id]
      );
      await conn.commit();
      return res.send("login complete!");
    } else {
      return res
        .status(400)
        .json({ message: "Cannot login, username or password wrong" });
    }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
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
    return res.send(
      "delete login_system of n_id : " + req.params.id + " complete!"
    );
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
  deleteLogin,
};
