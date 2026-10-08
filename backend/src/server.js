const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const seedHotels = require("./seed");
const healthRoutes = require("./routes/health");
const hotelRoutes = require("./routes/hotels");
const bookingRoutes = require("./routes/bookings");
const errorHandler = require("./middleware/errorHandler");
const { register, httpRequests } = require("./metrics");

const app = express();
const PORT = process.env.PORT || 5000;

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", limiter);

app.use((req, res, next) => {
  res.on("finish", () => {
    const route = req.route?.path || req.path;
    httpRequests.inc({ method: req.method, route, status: String(res.statusCode) });
  });
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Hotel Booking API is running" });
});
app.use("/api/health", healthRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    await seedHotels();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Hotel API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = app;
