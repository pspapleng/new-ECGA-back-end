const { config } = require("../configs/pg.config");
const resultSchema = require("../schema/result.schema");

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
      "SELECT * FROM users RIGHT JOIN form_result USING (u_id) JOIN nurse USING (n_id) WHERE u_id = ? order by result_date",
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

async function getResultByResultid(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM users RIGHT JOIN form_result USING (u_id) JOIN nurse USING (n_id) WHERE result_id = ?",
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

async function createResult(req, res, next) {
  const result = req.body.result;
  const u_id = req.body.u_id;

  // validate
  try {
    await resultSchema.validateAsync(
      {
        result,
        u_id,
      },
      { abortEarly: false }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [
      rows1,
      fields1,
    ] = await conn.query(
      "SELECT * FROM form_result WHERE result_date = current_date and u_id = ?",
      [u_id]
    );
    let checkResult = rows1;
    if (checkResult.length > 0) {
      return res.status(400).json({
        message: "Cannot add duplicate result",
      });
    } else {
      await conn.query(
        "INSERT INTO form_result (result, result_date, u_id) VALUES (?, current_date, ?);",
        [JSON.stringify(result), u_id]
      );
      await conn.commit();
      return res.send("add result complete!");
    }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function getLatestResultByUid(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM form_result WHERE u_id = ? ORDER BY result_date DESC limit 1",
      req.params.id
    );
    let result_date = rows;
    await conn.commit();
    return res.send(result_date);
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
  getResultByResultid,
  createResult,
  getLatestResultByUid,
};
