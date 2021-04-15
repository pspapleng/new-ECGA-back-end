const mysql = require("mysql2/promise");

const config = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  port: 3307,
  password: "password",
  database: "for-test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// async function query(sql, params) {
//   const connection = await mysql.createConnection(config.db);
//   const [results] = await connection.execute(sql, params);

//   return results;
// }

// module.exports = { config, query };
module.exports = { config };
