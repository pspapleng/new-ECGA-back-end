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

//ข้อมูลจากตาราง form_ans ที่มี result_id = id
async function getAnsByResultid(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows1, fields1] = await conn.query(
      "SELECT * FROM form_ans WHERE result_id = ?",
      req.params.id
    );
    let ans = rows1;
    let [rows2, fields2] = await conn.query(
      "SELECT * FROM form_result r RIGHT JOIN users u ON u.u_id = r.u_id WHERE result_id = ?",
      req.params.id
    );
    let user = rows2[0];
    await conn.commit();
    return res.send({
      user,
      ans,
    });
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

  // validate
  try {
    await ansSchema.validateAsync(ans);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
  //check array is unique
  const isEverythingUnique = (arr, key) => {
    const uniques = new Set(arr.map((item) => item[key]));
    return [...uniques].length === arr.length;
  };
  const check = isEverythingUnique(ans, "ques_id");
  console.log(check);
  if (check) {
    const conn = await config.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
      const [rows, _] = await config.query(
        "SELECT result_id FROM form_result order by result_id desc limit 1"
      );
      let id = rows[0].result_id;
      console.log(id);

      for (let i = 0; i < ans.length; i++) {
        await conn.query(
          "INSERT INTO form_ans (ans_title, ans_value, ques_id, u_id, result_id) VALUES (?, ?, ?, ?, ?);",
          [ans[i].ans_title, ans[i].ans_value, ans[i].ques_id, ans[i].u_id, id]
        );
        await conn.commit();
        return res.send("add ans complete!");
      }
    } catch (err) {
      await conn.rollback();
      return res.status(500).json(err);
    } finally {
      console.log("finally");
      conn.release();
    }
  } else {
    console.log("not unique");
    return res.status(400).json({
      message: "Answers don't has unique ques_id",
    });
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
  getAnsByResultid,
  createAns,
  getLatestAnsByUid,
};
