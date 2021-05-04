const mysql = require("mysql2/promise");

const config = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: "root",
  port: 3306,
  password: "pleang3343",
  database: "last-ecga",
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
