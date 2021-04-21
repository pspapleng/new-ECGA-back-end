const { config } = require("../configs/pg.config");

async function getAllNurse(req, res, next) {
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

async function getNurse(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM nurse WHERE n_id = ?",
      [req.params.id]
    );
    let nurse = rows[0];
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
  const ID = "ว" + req.body.id;
  const n_fname = req.body.n_fname;
  const n_lname = req.body.n_lname;
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body);

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows1, fields1] = await conn.query(
      "SELECT * FROM nurse WHERE ID = ?",
      [ID]
    );
    let checkID = rows1;
    // console.log(checkID);
    if (checkID.length > 0) {
      return res.status(400).json({
        message: "Cannot register, already have ID",
      });
    } else {
      let [
        rows2,
        fields2,
      ] = await conn.query("SELECT * FROM nurse WHERE username = ?", [
        username,
      ]);
      let checkUsername = rows2;
      if (checkUsername.length > 0) {
        return res.status(400).json({
          message: "Cannot register, username is already used",
        });
      } else {
        await conn.query(
          "INSERT INTO nurse(ID, n_fname, n_lname, username, password) VALUES (?, ?, ?, ?, ?);",
          [ID, n_fname, n_lname, username, password]
        );
        await conn.commit();
        return res.send("nurse register complete!");
      }
    }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function updateNurse(req, res, next) {
  const n_fname = req.body.n_fname;
  const n_lname = req.body.n_lname;
  const username = req.body.username;
  const password = req.body.password;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    await conn.query(
      "UPDATE nurse SET n_fname = ?, n_lname = ?, username = ?, password = ? WHERE n_id = ?;",
      [n_fname, n_lname, username, password, req.params.id]
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

module.exports = { getAllNurse, getNurse, createNurse, updateNurse };
