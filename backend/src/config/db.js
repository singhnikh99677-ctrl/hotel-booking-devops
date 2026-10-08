
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "hotel_booking",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connectDB() {
  const connection = await pool.getConnection();
  console.log("MySQL connected");
  connection.release();
  await initializeDatabase();
}

async function initializeDatabase() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS hotels (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      place VARCHAR(100) NOT NULL,
      price_per_night DECIMAL(10,2) NOT NULL,
      image TEXT NOT NULL,
      amenities TEXT NOT NULL
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hotel_id INT NOT NULL,
      hotel_name VARCHAR(150) NOT NULL,
      place VARCHAR(100) NOT NULL,
      guest_name VARCHAR(80) NOT NULL,
      guests INT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      nights INT NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(30) DEFAULT 'CONFIRMED',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hotel_id) REFERENCES hotels(id)
    )
  `);
}

module.exports = { pool, connectDB };
