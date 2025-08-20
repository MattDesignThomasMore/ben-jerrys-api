// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Routes & middleware
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("./controllers/orderController");

dotenv.config();

const app = express();

/* -------------------------- CORS: allowlist frontends -------------------------- */
const allowedOrigins = [
  "https://ben-jerrys-iceconfigurator.onrender.com",
  "https://ben-jerrys-backoffice.onrender.com",
  "http://localhost:5173", // Vite dev
  "http://localhost:8080", // Vue CLI dev (indien gebruikt)
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // bv. curl/Postman/health
      return allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ------------------------------ Body parsing etc. ------------------------------ */
app.use(express.json());

/* --------------------------------- Health/root -------------------------------- */
app.get("/", (_req, res) => {
  res.send("🍦 Ben & Jerry's API is live!");
});
app.get("/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

/* ------------------------------------ Auth ------------------------------------ */
app.use("/api/auth", authRoutes);

/* ----------------------------------- Orders ----------------------------------- */
const orderRouter = require("express").Router();

// Publieke endpoint om bestelling te plaatsen (geen auth)
orderRouter.post("/", createOrder);

// Alle andere order-acties beschermd
orderRouter.use(authenticateToken);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.put("/:id", updateOrderStatus);
orderRouter.delete("/:id", deleteOrder);

app.use("/api/orders", orderRouter);

/* --------------------------------- Database ----------------------------------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log("🚀 Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

/* ----------------------------- Fallback error log ------------------------------ */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});
