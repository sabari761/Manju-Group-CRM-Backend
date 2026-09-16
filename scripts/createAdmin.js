require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDatabase = require("../config/db");
const User = require("../models/User");

async function createAdmin() {
    const requiredVariables = ["ADMIN_NAME", "ADMIN_MOBILE", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
    const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

    if (missingVariables.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
    }

    if (process.env.ADMIN_PASSWORD.length < 6) {
        throw new Error("ADMIN_PASSWORD must be at least 6 characters");
    }

    await connectDatabase();

    const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingUser) {
        throw new Error("A user with this email already exists");
    }

    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await User.create({
        name: process.env.ADMIN_NAME,
        mobileNumber: process.env.ADMIN_MOBILE,
        email: process.env.ADMIN_EMAIL,
        password,
        role: "SUPER_ADMIN"
    });

    console.log("Admin account created successfully.");
}

createAdmin()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close().catch(() => {});
    });