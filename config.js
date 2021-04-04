const env = process.env;

const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: env.DB_HOST || "127.0.0.1",
    user: env.DB_USER || "user",
    port: 3307,
    password: env.DB_PASSWORD || "password",
    database: env.DB_NAME || "db",
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;
