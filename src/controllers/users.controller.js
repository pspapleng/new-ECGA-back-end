const { config } = require("../configs/pg.config");
const usersSchema = require("../schema/users.schema");

async function getAllUsers(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM users right JOIN form_result USING (u_id)"
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

async function getUsersByUid(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query(
      "SELECT * FROM users left JOIN nurse USING (n_id) WHERE u_id = ?",
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

async function createUsers(req, res, next) {
  //เติม 0 จนกว่าจะครบ 9 หลัก
  function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }
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
    //check this user don't have result
    let [
      rows1,
      fields1,
    ] = await conn.query(
      "SELECT * FROM users where u_fname = ? and u_lname = ?",
      [u_fname, u_lname]
    );
    let checkName = rows1;
    if (checkName.length > 0) {
      return res.status(400).json({
        message: "Cannot register, already have user",
      });
    } else {
      let [rows2, fields2] = await conn.query(
        "SELECT u_id FROM users ORDER BY u_id DESC limit 1"
      );
      let latest_id = rows2[0].u_id;
      let HN = pad(latest_id + 1, 9);
      // validate
      try {
        await usersSchema.validateAsync(
          {
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
          },
          { abortEarly: false }
        );
      } catch (err) {
        return res.status(400).json(err);
      }
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
    }
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
  const gender = req.body.gender; //female = 1, male = 2
  const date_of_birth = req.body.date_of_birth; // yyyy-mm-dd ex. 1959-12-17
  const weight = req.body.weight;
  const height = req.body.height;
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

async function deleteUsers(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    //check this user don't have result
    let [
      rows1,
      fields,
    ] = await conn.query("SELECT result_id FROM form_result where u_id = ?", [
      req.params.id,
    ]);
    let checkResult = rows1;
    if (checkResult.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete, This user have result" });
    } else {
      await conn.query(`DELETE from users WHERE u_id = ?;`, [req.params.id]);
      //ค้นหา id ล่าสุด เพื่อไปเซตค่า AI
      let [rows2, fields] = await conn.query(
        "SELECT u_id FROM users ORDER BY u_id DESC limit 1"
      );
      let latest_id = rows2[0].u_id;
      await conn.query(`ALTER TABLE users AUTO_INCREMENT = ? ;`, [latest_id]);
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

async function searchUsers(req, res, next) {}

module.exports = {
  getAllUsers,
  getUsersByUid,
  createUsers,
  updateUsers,
  deleteUsers,
};
