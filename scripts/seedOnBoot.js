const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

module.exports = async function seedOnBoot() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const auto = String(process.env.ADMIN_AUTO_SEED || "true").toLowerCase();

 
    if (!email || !password || auto !== "true") {
      console.log("ℹ️ Admin auto-seed overslagen (ADMIN_EMAIL/PASSWORD/ADMIN_AUTO_SEED).");
      return;
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("ℹ️ Admin bestaat al:", email);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash });
    console.log("✅ Admin aangemaakt:", email);
  } catch (err) {
    console.error("❌ Fout bij admin auto-seed:", err.message);
  }
};
