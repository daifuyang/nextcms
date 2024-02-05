const mysql = require("mysql2");

export default function create() {
  return new Promise<void>((resolve, reject) => {
    // 创建数据库连接
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    try {
      connection.connect();

      const createDatabaseQuery = `
  CREATE DATABASE IF NOT EXISTS ??
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
`;

      connection.query(createDatabaseQuery, [process.env.DB_DATABASE], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
        connection.end();
      });
    } catch (error) {
      reject(error);
    }
  });
}
