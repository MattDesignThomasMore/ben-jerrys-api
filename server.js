// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// routes/middleware/controllers
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("./controllers/orderController");

// ⬇️ auto-seed bij opstart
const seedOnBoot = require("./scripts/seedOnBoot");

dotenv.config();

const app = express();

/** CORS — whitelist je twee frontends + lokaal dev */
const allowedOrigins = [
  "https://ben-jerrys-iceconfigurator.onrender.com",
  "https://ben-jerrys-backoffice.onrender.com",
  "http://localhost:5173", // Vite
  "http://localhost:8080", // Vue CLI
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      return allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // accepteer form-encoded

app.get("/", (_req, res) => res.send("🍦 Ben & Jerry's API is live!"));
app.get("/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

/** Auth routes */
app.use("/api/auth", authRoutes);

/** Orders (POST publiek, rest beschermd) */
const orderRouter = require("express").Router();
orderRouter.post("/", createOrder);
orderRouter.use(authenticateToken);
orderRouter.get("/", getOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.put("/:id", updateOrderStatus);
orderRouter.delete("/:id", deleteOrder);
app.use("/api/orders", orderRouter);

/** Start server als DB verbonden is + auto-seed admin */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // ⬇️ DIT IS DE AUTO-SEED CALL
    await seedOnBoot();

    app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
  })
  .catch((err) => {
    console.error("❌ Mongo connection error:", err.message);
    process.exit(1);
  });

/** Fallback error handler */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});
