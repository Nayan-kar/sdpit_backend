const mysql = require('mysql2/promise');

async function test() {
  try {
    const db = mysql.createPool({
      host: "127.0.0.1",
      user: "u760412973_appuser",
      password: "Test@12345Ab#",
      database: "u760412973_appdb",
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log("Attempting to connect...");
    const [rows] = await db.query('SELECT 1');
    console.log("Connection successful:", rows);
    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

test();
