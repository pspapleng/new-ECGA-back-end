const { config } = require("../configs/pg.config");

async function getAllResult(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query("SELECT * FROM form_result");
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

async function getResultByUid(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM form_result WHERE u_id = ?",
      req.params.id
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

async function getResult(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM form_result WHERE result_id = ?",
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

async function createResult(req, res, next) {
  const result = req.body.result;
  const u_id = req.body.u_id;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    await conn.query(
      "INSERT INTO form_result (result, result_date, u_id) VALUES (?, current_date(), ?);",
      [result, u_id]
    );
    await conn.commit();
    return res.send("add result complete!");
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

module.exports = {
  getAllResult,
  getResultByUid,
  getResult,
  createResult,
};
