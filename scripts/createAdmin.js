const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("❌ ADMIN_EMAIL of ADMIN_PASSWORD ontbreekt in .env");
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Admin.deleteMany({});
    await Admin.create({ email, passwordHash });

    console.log("✅ Admin user aangemaakt!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Fout bij connectie:", err);
    process.exit(1);
  });
