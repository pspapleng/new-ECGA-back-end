const { config } = require("../configs/pg.config");

async function getUsers(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM users LEFT JOIN form_result USING (u_id)"
    );
    let user = rows;
    await conn.commit();
    return res.send(user);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function createUsers(req, res, next) {
  const HN = req.body.HN;
  const u_fname = req.body.u_fname;
  const u_lname = req.body.u_lname;
  const date_of_birth = req.body.date_of_birth; // yyyy-mm-dd ex. 1959-12-17
  const gender = req.body.gender; //female = 1, male = 2
  const height = req.body.height;
  const weight = req.body.weight;
  const bmi = req.body.bmi; //คำนวณจาก height และ weight
  const waistline = req.body.waistline;
  const fall_history = req.body.fall_history;
  const n_id = req.body.n_id; //พยาบาลที่ login อยู่ === ผู้ซักประวัติ

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    await conn.query(
      "INSERT INTO users (HN, u_fname, u_lname, date_of_birth, gender, service_date, height, weight, bmi, waistline, fall_history, n_id) VALUES (?, ?, ?, ?, ?, current_date(), ?, ?, ?, ?, ?, ?);",
      [
        HN,
        u_fname,
        u_lname,
        date_of_birth,
        gender,
        height,
        weight,
        bmi,
        waistline,
        fall_history,
        n_id,
      ]
    );
    await conn.commit();
    return res.send("users register complete!");
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function updateUsers(req, res, next) {
  const u_fname = req.body.u_fname;
  const u_lname = req.body.u_lname;
  const date_of_birth = req.body.date_of_birth; // yyyy-mm-dd ex. 1959-12-17
  const gender = req.body.gender; //female = 1, male = 2
  const height = req.body.height;
  const weight = req.body.weight;
  const bmi = req.body.bmi; //คำนวณจาก height และ weight
  const waistline = req.body.waistline;
  const fall_history = req.body.fall_history;

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    await conn.query(
      "UPDATE users SET u_fname = ?, u_lname = ?, date_of_birth = ?, gender = ?, height = ?, weight = ?, bmi = ?, waistline = ?, fall_history = ? WHERE u_id = ?;",
      [
        u_fname,
        u_lname,
        date_of_birth,
        gender,
        height,
        weight,
        bmi,
        waistline,
        fall_history,
        req.params.id,
      ]
    );
    await conn.commit();
    return res.send("update user id : " + req.params.id + " complete!");
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

async function deleteUser(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    //check this user don't have result
    let [
      rows,
      fields,
    ] = await conn.query("SELECT result_id FROM form_result where u_id = ?", [
      req.params.id,
    ]);
    let results = rows[0];
    if (results.result_id !== null) {
      return res
        .status(400)
        .json({ message: "Cannot delete, This user have result" });
    } else {
      await conn.query("DELETE from users WHERE u_id = ?;", [req.params.id]);
      await conn.commit();
      return res.send("delete user id : " + req.params.id + " complete!");
    }
    // console.log(results);

    // Delete the selected blog
    // const [
    //   rows2,
    //   fields2,
    // ] = await conn.query("DELETE FROM `blogs` WHERE `id` = ?", [
    //   req.params.blogId,
    // ]);

    // if (rows2.affectedRows === 1) {
    //   await conn.commit();
    //   res.status(204).send();
    // } else {
    //   throw "Cannot delete the selected blog";
    // }
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

module.exports = { getUsers, createUsers, updateUsers, deleteUser };
