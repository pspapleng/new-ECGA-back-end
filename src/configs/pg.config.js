const mysql = require("mysql2/promise");

const config = mysql.createPool({
  host: process.env.DB_HOST,
  user: "user",
  port: 3307,
  password: "password",
  database: "e-cga",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// const config = {
//   db: {
//     /* don't expose password or any sensitive info, done only for demo */
//     host: env.DB_HOST || "127.0.0.1",
//     user: env.DB_USER || "root",
//     port: 3307,
//     password: env.DB_PASSWORD || "password",
//     database: env.DB_NAME || "e-cga-database",
//   },
//   listPerPage: env.LIST_PER_PAGE || 10,
// };

// async function query(sql, params) {
//   const connection = await mysql.createConnection(config.db);
//   const [results] = await connection.execute(sql, params);

//   return results;
// }

// module.exports = { config, query };
module.exports = { config };
