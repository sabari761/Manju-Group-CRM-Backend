const User = require("../models/User");
const bcrypt = require("bcryptjs");

const roleRank = { SALES_EMPLOYEE: 1, LIMITED_ADMIN: 2, ADMIN: 3, SUPER_ADMIN: 4 };

function canManageRole(managerRole, targetRole) {
    return roleRank[managerRole] > roleRank[targetRole];
}

async function listEmployees(req, res, next) {
    try {
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
        const search = req.query.search ? req.query.search.trim() : "";
        const filter = search ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { mobileNumber: { $regex: search, $options: "i" } }
            ]
        } : {};
        const [data, total] = await Promise.all([
            User.find(filter).select("name mobileNumber email role").sort({ name: 1 }).skip((page - 1) * limit).limit(limit),
            User.countDocuments(filter)
        ]);
        res.json({ success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
}

async function getEmployee(req, res, next) {
    try {
        const data = await User.findById(req.params.id).select("name mobileNumber email role");
        if (!data) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, data });
    } catch (error) { next(error); }
}

async function createEmployee(req, res, next) {
    try {
        if (!canManageRole(req.user.role, req.body.role)) {
            return res.status(403).json({ success: false, message: "You cannot create a user with this role" });
        }
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return res.status(409).json({ success: false, message: "Email is already registered" });
        const data = await User.create({
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            role: req.body.role
        });
        res.status(201).json({ success: true, message: "User created successfully", data: { id: data._id, name: data.name, mobileNumber: data.mobileNumber, email: data.email, role: data.role } });
    } catch (error) { next(error); }
}

async function updateEmployee(req, res, next) {
    try {
        const data = await User.findById(req.params.id).select("+password");
        if (!data) return res.status(404).json({ success: false, message: "User not found" });
        if (!canManageRole(req.user.role, data.role)) {
            return res.status(403).json({ success: false, message: "You cannot update this user" });
        }
        if (req.body.role && !canManageRole(req.user.role, req.body.role)) {
            return res.status(403).json({ success: false, message: "You cannot assign this role" });
        }
        if (req.body.email && req.body.email !== data.email) {
            const existingUser = await User.findOne({ email: req.body.email, _id: { $ne: data._id } });
            if (existingUser) return res.status(409).json({ success: false, message: "Email is already registered" });
        }
        ["name", "mobileNumber", "email", "role"].forEach((field) => {
            if (req.body[field] !== undefined) data[field] = req.body[field];
        });
        if (req.body.password) data.password = await bcrypt.hash(req.body.password, 10);
        await data.save();
        res.json({ success: true, message: "User updated successfully", data: { id: data._id, name: data.name, mobileNumber: data.mobileNumber, email: data.email, role: data.role } });
    } catch (error) { next(error); }
}

async function deleteEmployee(req, res, next) {
    try {
        if (req.params.id === req.user._id.toString()) return res.status(400).json({ success: false, message: "You cannot delete your own account" });
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (!canManageRole(req.user.role, user.role)) {
            return res.status(403).json({ success: false, message: "You cannot delete this user" });
        }
        const data = await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) { next(error); }
}

module.exports = { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };