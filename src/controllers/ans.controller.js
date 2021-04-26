const Joi = require("joi");
const { config } = require("../configs/pg.config");
const ansSchema = require("../schema/ans.schema");

async function getAllAns(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query("SELECT * FROM form_ans");
    let ans = rows;
    await conn.commit();
    return res.send(ans);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

//ข้อมูลจากตาราง form_ans ที่มี u_id = id
async function getAnsByUid(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM form_ans WHERE u_id = ?",
      req.params.id
    );
    let ans = rows;
    await conn.commit();
    return res.send(ans);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function createAns(req, res, next) {
  const ans = req.body;
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  // validate
  try {
    await ansSchema.validateAsync(ans);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
  try {
    let [
      rows1,
      fields1,
    ] = await conn.query(
      "SELECT * FROM form_ans WHERE (ans_time = ? and ques_id = ?) and u_id = ? ",
      [ans_time, ques_id, u_id]
    );
    let checkAns = rows1;
    if (checkAns.length > 0) {
      return res.status(400).json({
        message: "Cannot add duplicate answer",
      });
    } else {
      await conn.query(
        "INSERT INTO form_ans (ans_title, ans_value, ans_time, ques_id, u_id) VALUES (?, ?, ?, ?, ?);",
        [ans_title, ans_value, ans_time, ques_id, u_id]
      );
      await conn.commit();
      return res.send("add ans for ques : " + ques_id + " complete!");
    }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function getLatestAnsByUid(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "(SELECT * FROM form_ans WHERE u_id = ? ORDER BY ans_time DESC limit 162) order by ques_id",
      req.params.id
    );
    let latest_ans = rows;
    await conn.commit();
    return res.send(latest_ans);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

module.exports = {
  getAllAns,
  getAnsByUid,
  createAns,
  getLatestAnsByUid,
};
