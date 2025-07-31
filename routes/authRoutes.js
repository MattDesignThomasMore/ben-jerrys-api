const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// 👉 Voorbeeld admin user (je kan dit later vervangen met een echte DB-lookup)
const ADMIN_EMAIL = "admin@benjerrys.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("superveilig123", 10); // wachtwoord: superveilig123

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ message: "Ongeldige inloggegevens" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

module.exports = router;
