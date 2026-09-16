const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["SUPER_ADMIN", "ADMIN", "LIMITED_ADMIN", "SALES_EMPLOYEE"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);