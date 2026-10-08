const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    status: "UP",
    service: "hotel-booking-backend",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
