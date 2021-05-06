const { config } = require("../configs/pg.config");
const nurseSchema = require("../schema/nurse.schema");
const updateNurseSchema = require("../schema/updatenurse.schema");
const bcrypt = require("bcrypt");

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
  let password = req.body.password;
  const confirm_password = req.body.confirm_password;
  console.log(req.body);
  console.log(ID);
  // validate
  try {
    await nurseSchema.validateAsync(
      {
        ID,
        n_fname,
        n_lname,
        username,
        password,
        confirm_password,
      },
      { abortEarly: false }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }

  password = await bcrypt.hash(req.body.password, 5);
  console.log(ID);

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
  const n_fname = req.body.n_fname;
  const n_lname = req.body.n_lname;
  const username = req.body.username;
  const old_password = req.body.old_password;
  let password = req.body.new_password;
  const confirm_password = req.body.confirm_password;

  console.log("up", req.body);

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [nurse] = await conn.query("SELECT * FROM nurse WHERE n_id = ?", [
      req.params.id,
    ]);

    let who = nurse[0];

    // Check if password is correct
    if (!(await bcrypt.compare(old_password, who.password))) {
      await conn.commit();
      return res.status(200).json({ message: "Incorrect password" });
    } else {
      // validate
      try {
        await updateNurseSchema.validateAsync(
          {
            n_fname,
            n_lname,
            username,
            password,
            confirm_password,
          },
          { abortEarly: false }
        );
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }

      password = await bcrypt.hash(req.body.new_password, 5);

      await conn.query(
        "UPDATE nurse SET n_fname = ?, n_lname = ?, username = ?, password = ? WHERE n_id = ?;",
        [n_fname, n_lname, username, password, req.params.id]
      );
      await conn.commit();
      return res
        .status(200)
        .json({ message: "update nurse id : " + req.params.id + " complete!" });
    }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function checkPassword(req, res, next) {
  const old_password = req.body.old_password;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [nurse] = await conn.query("SELECT * FROM nurse WHERE n_id = ?", [
      req.params.id,
    ]);

    let who = nurse[0];

    // Check if password is correct
    if (!(await bcrypt.compare(old_password, who.password))) {
      await conn.commit();
      return res.status(200).json({ message: "Incorrect password" });
    } else {
      await conn.commit();
      return res.status(200).json({ message: "OK" });
    }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

module.exports = {
  getAllNurse,
  getNurse,
  createNurse,
  updateNurse,
  checkPassword,
};
