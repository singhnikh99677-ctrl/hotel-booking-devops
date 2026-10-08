
const router = require("express").Router();
const { pool } = require("../config/db");

function formatHotel(row) {
  return {
    _id: String(row.id),
    name: row.name,
    place: row.place,
    pricePerNight: Number(row.price_per_night),
    image: row.image,
    amenities: JSON.parse(row.amenities || "[]")
  };
}

router.get("/", async (req, res, next) => {
  try {
    const place = req.query.place;
    const [rows] = place
      ? await pool.execute(
          "SELECT * FROM hotels WHERE place LIKE ? ORDER BY price_per_night",
          [`%${place}%`]
        )
      : await pool.execute("SELECT * FROM hotels ORDER BY price_per_night");

    res.json(rows.map(formatHotel));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM hotels WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Hotel not found" });
    res.json(formatHotel(rows[0]));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
