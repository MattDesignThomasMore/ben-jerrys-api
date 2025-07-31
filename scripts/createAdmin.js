// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = 'admin@benjerrys.com';
    const password = 'superveilig123';
    const passwordHash = await bcrypt.hash(password, 10);

    await Admin.deleteMany({}); // 🧹 optioneel: oude admins verwijderen
    await Admin.create({ email, passwordHash });

    console.log('✅ Admin user aangemaakt!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Fout bij connectie:', err);
    process.exit(1);
  });
