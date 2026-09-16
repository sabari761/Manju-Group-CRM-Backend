const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function publicUser(user) {
    return { id: user._id, name: user.name, mobileNumber: user.mobileNumber, email: user.email, role: user.role };
}

async function setupInitialAdmin(req, res, next) {
    try {
        if (!process.env.INITIAL_ADMIN_SETUP_KEY) {
            return res.status(503).json({ success: false, message: "Initial admin setup is not configured" });
        }
        if (req.headers["x-setup-key"] !== process.env.INITIAL_ADMIN_SETUP_KEY) {
            return res.status(401).json({ success: false, message: "Invalid setup key" });
        }
        if (await User.exists({})) {
            return res.status(409).json({ success: false, message: "Initial admin already exists. Use the users API instead" });
        }

        const password = await bcrypt.hash(req.body.password, 12);
        const user = await User.create({
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            password,
            role: "SUPER_ADMIN"
        });
        res.status(201).json({ success: true, message: "Initial SUPER_ADMIN created successfully", user: publicUser(user) });
    } catch (error) { next(error); }
}

async function login(req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email }).select("+password");
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "JWT_SECRET is not configured" });
        }
        const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ success: true, message: "Login successful", token, user: publicUser(user) });
    } catch (error) { next(error); }
}

async function me(req, res) {
    res.json({ success: true, data: publicUser(req.user) });
}

module.exports = { setupInitialAdmin, login, me };