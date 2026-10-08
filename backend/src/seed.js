
const { pool } = require("./config/db");

const sampleHotels = [
  [
    "Sea View Residency",
    "Mumbai",
    3200,
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80",
    JSON.stringify(["Wi-Fi", "Breakfast", "Sea View"])
  ],
  [
    "Palm Grove Resort",
    "Goa",
    4800,
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    JSON.stringify(["Pool", "Wi-Fi", "Breakfast"])
  ],
  [
    "City Comfort Inn",
    "Delhi",
    2100,
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    JSON.stringify(["Wi-Fi", "Parking", "AC"])
  ]
];

async function seedHotels() {
  const [rows] = await pool.execute("SELECT COUNT(*) AS count FROM hotels");
  if (rows[0].count === 0) {
    await pool.query(
      "INSERT INTO hotels (name, place, price_per_night, image, amenities) VALUES ?",
      [sampleHotels]
    );
    console.log("3 sample hotels inserted");
  }
}

module.exports = seedHotels;
