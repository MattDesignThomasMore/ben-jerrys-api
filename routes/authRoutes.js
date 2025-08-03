// routes/authRoutes.js
const LoginLog = require('../models/LoginLog');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    const isMatch = admin && await bcrypt.compare(password, admin.passwordHash);
    const success = !!(admin && isMatch);


    await LoginLog.create({
      email,
      success,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    if (!success) {
      return res.status(401).json({ message: 'Login mislukt: controleer je e-mailadres en wachtwoord.' });
    }

    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    console.error('Login fout:', err);
    res.status(500).json({ message: 'Serverfout bij inloggen' });
  }
});


module.exports = router;
