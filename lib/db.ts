import mysql from "mysql2/promise";

function getConfig() {
  const databaseUrl =
    process.env.MYSQL_URL ||
    process.env.DATABASE_URL ||
    process.env.MYSQL_PUBLIC_URL ||
    process.env.MYSQLPRIVATE_URL;

  if (databaseUrl) {
    return databaseUrl;
  }

  return {
    host: process.env.MYSQL_HOST || process.env.DB_HOST,
    port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || "3306", 10),
    user: process.env.MYSQL_USER || process.env.DB_USER,
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
    database:
      process.env.MYSQL_DATABASE ||
      process.env.DB_NAME ||
      process.env.MYSQLDATABASE ||
      process.env.RAILWAY_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

const pool = mysql.createPool(getConfig());

export default pool;
