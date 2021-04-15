const { config } = require("../configs/pg.config");

async function getNurse(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query("SELECT * FROM nurse");
    let nurse = rows;
    await conn.commit();
    return res.send(nurse);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function createNurse(req, res, next) {
  const ID = req.body.ID;
  const n_fname = req.body.n_fname;
  const n_lname = req.body.n_lname;
  const username = req.body.username;
  const password = req.body.password;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    await conn.query(
      "INSERT INTO nurse(ID, n_fname, n_lname, username, password) VALUES (?, ?, ?, ?, ?);",
      [ID, n_fname, n_lname, username, password]
    );
    await conn.commit();
    return res.send("nurse register complete!");
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function updateNurse(req, res, next) {
  const ID = req.body.ID;
  const n_fname = req.body.n_fname;
  const n_lname = req.body.n_lname;
  const username = req.body.username;
  const password = req.body.password;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    await conn.query(
      "UPDATE nurse SET ID = ?, n_fname = ?, n_lname = ?, username = ?, password = ? WHERE n_id = ?;",
      [ID, n_fname, n_lname, username, password, req.params.id]
    );
    await conn.commit();
    return res.send("update nurse id : " + req.params.id + " complete!");
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

module.exports = { getNurse, createNurse, updateNurse };
