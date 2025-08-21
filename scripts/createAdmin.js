const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("ADMIN_EMAIL en ADMIN_PASSWORD ontbreken in env.");
      process.exit(1);
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("Admin bestaat al:", email);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash });
    console.log("✅ Admin user aangemaakt:", email);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
