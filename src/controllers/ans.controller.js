const { config } = require("../configs/pg.config");

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
async function getAns(req, res, next) {
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
  const ans_title = req.body.ans_title;
  const ans_value = req.body.ans_value;
  const ans_time = req.body.ans_time;
  const ques_id = req.body.ques_id;
  const u_id = req.body.u_id;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    await conn.query(
      "INSERT INTO form_ans (ans_title, ans_value, ans_time, ques_id, u_id) VALUES (?, ?, ?, ?, ?);",
      [ans_title, ans_value, ans_time, ques_id, u_id]
    );
    await conn.commit();
    return res.send("add ans complete!");
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
  getAns,
  createAns,
};
