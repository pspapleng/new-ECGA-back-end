const { config } = require("../configs/pg.config");
const usersSchema = require("../schema/users.schema");

async function getAllUsers(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    const search = req.query.search || "";
    console.log(req.query.search);

    let sql = `select *
      from users u
      left join (select n_id, n_fname, n_lname
            from nurse) n
      on (u.n_id = n.n_id)
      left join form_result
      using (u_id)
      where result_id in (select max(result_id)
      from form_result
      group by u_id
      having max(result_id))
      or result_id is null
      order by u_id`;
    let cond = [];

    if (search.length > 0) {
      sql = `select *
      from users u
      left join (select n_id, n_fname, n_lname
            from nurse) n
      on (u.n_id = n.n_id)
      left join form_result
      using (u_id)
      where (result_id in (select max(result_id)
      from form_result
      group by u_id
      having max(result_id))
      or result_id is null)
      and (u_fname LIKE ? OR u_lname LIKE ?)
      order by u_id`;
      cond = [`%${search}%`, `%${search}%`];
    }
    const [rows, fields] = await conn.query(sql, cond);
    await conn.commit();
    return res.json(rows);
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
      `select *
      from users u
      join (select n_id, n_fname, n_lname
            from nurse) n
            on (u.n_id = n.n_id)
      where u_id = ?`,
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
  const height = req.body.height.toString();
  const weight = req.body.weight.toString();
  const bmi = req.body.bmi.toString(); //คำนวณจาก height และ weight
  const waistline = req.body.waistline.toString();
  const fall_history = req.body.fall_history;
  const n_id = req.body.n_id; //พยาบาลที่ login อยู่ === ผู้ซักประวัติ

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    //check don't have this user
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
      // run HN
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
        console.log(err);
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
  const date_of_birth = req.body.date_of_birth; // yyyy-mm-dd ex. 1959-12-17
  let gender = req.body.gender; //female = 1, male = 2
  const height = req.body.height.toString();
  const weight = req.body.weight.toString();
  const bmi = req.body.bmi.toString(); //คำนวณจาก height และ weight
  const waistline = req.body.waistline.toString();
  const fall_history = req.body.fall_history;
  const n_id = req.body.n_id; //พยาบาลที่ login อยู่ === ผู้แก้ไขเป็นพยาบาลจริง ไม่ต้องแก้ลงดาต้าเบส

  if (gender == "Female") {
    gender = 1;
  }
  if (gender == "Male") {
    gender = 2;
  }

  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
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
    console.log(err);
    return res.status(400).json(err);
  }
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
