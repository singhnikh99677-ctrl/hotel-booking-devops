
const router = require("express").Router();
const { pool } = require("../config/db");

router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, hotel_name AS hotelName, place, guest_name AS guestName,
             guests, DATE_FORMAT(check_in, '%Y-%m-%d') AS checkIn,
             DATE_FORMAT(check_out, '%Y-%m-%d') AS checkOut,
             nights, total_amount AS totalAmount, status
      FROM bookings
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json(rows.map(b => ({ ...b, totalAmount: Number(b.totalAmount) })));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { hotelId, guestName, checkIn, checkOut, guests } = req.body;

    if (!hotelId || !guestName || !checkIn || !checkOut || !Number.isInteger(Number(guests))) {
      return res.status(400).json({ message: "Please provide all booking details" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }

    const [hotelRows] = await pool.execute("SELECT * FROM hotels WHERE id = ?", [hotelId]);
    if (!hotelRows.length) return res.status(404).json({ message: "Hotel not found" });

    const hotel = hotelRows[0];
    const nights = Math.ceil((end - start) / 86400000);
    const totalAmount = nights * Number(hotel.price_per_night);

    const [result] = await pool.execute(
      `INSERT INTO bookings
       (hotel_id, hotel_name, place, guest_name, guests, check_in, check_out, nights, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')`,
      [
        hotel.id, hotel.name, hotel.place, guestName, Number(guests),
        checkIn, checkOut, nights, totalAmount
      ]
    );

    res.status(201).json({
      message: "Booking confirmed",
      booking: {
        id: result.insertId,
        hotelId: hotel.id,
        hotelName: hotel.name,
        place: hotel.place,
        guestName,
        guests: Number(guests),
        checkIn,
        checkOut,
        nights,
        totalAmount,
        status: "CONFIRMED"
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
