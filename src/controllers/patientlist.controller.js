const { config } = require("../configs/pg.config");

async function getNamelist(req, res, next) {
  const conn = await config.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [rows, fields] = await conn.query("SELECT * FROM users");

    await conn.commit();
    return res.send(rows);
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
}

module.exports = { getNamelist };
