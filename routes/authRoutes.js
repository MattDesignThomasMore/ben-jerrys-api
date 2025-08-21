const LoginLog = require("../models/LoginLog");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const body = req.body || {};
    const email = body.email?.trim();
    const password = body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email en wachtwoord zijn verplicht." });
    }

    const admin = await Admin.findOne({ email });
    const ok = admin && (await bcrypt.compare(password, admin.passwordHash));
    const success = !!ok;

    await LoginLog.create({
      email,
      success,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    if (!success) {
      return res.status(401).json({ message: "Login mislukt: controleer je e-mailadres en wachtwoord." });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Serverfout bij inloggen" });
  }
});

module.exports = router;
