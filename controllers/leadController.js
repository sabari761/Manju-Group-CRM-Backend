const Lead = require("../models/Lead");
const User = require("../models/User");

function canAccessLead(user, lead) {
    return ["SUPER_ADMIN", "ADMIN"].includes(user.role) || (lead.assignedTo && lead.assignedTo._id.toString() === user._id.toString());
}

async function createLead(req, res, next) {
    try {
        const data = { ...req.body };
        if (req.user.role === "SALES_EMPLOYEE") data.assignedTo = req.user._id;
        if (["SUPER_ADMIN", "ADMIN"].includes(req.user.role) && data.assignedTo) {
            const employee = await User.findById(data.assignedTo);
            if (!employee) return res.status(400).json({ success: false, message: "Assigned employee was not found" });
        }
        const lead = await Lead.create(data);
        res.status(201).json({ success: true, message: "Lead created successfully", data: lead });
    } catch (error) { next(error); }
}

async function listLeads(req, res, next) {
    try {
        const filter = {};
        if (req.query.stage) filter.stage = req.query.stage;
        if (req.user.role === "SALES_EMPLOYEE") filter.assignedTo = req.user._id;
        else if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
        if (req.query.search) {
            const search = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [{ name: search }, { phone: search }, { email: search }];
        }
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
        const [leads, total] = await Promise.all([
            Lead.find(filter).populate("assignedTo", "name email role").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            Lead.countDocuments(filter)
        ]);
        res.json({ success: true, data: leads, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
}

async function getLead(req, res, next) {
    try {
        const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email role");
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        if (!canAccessLead(req.user, lead)) return res.status(403).json({ success: false, message: "You cannot access this lead" });
        res.json({ success: true, data: lead });
    } catch (error) { next(error); }
}

async function updateLead(req, res, next) {
    try {
        const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email role");
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        if (!canAccessLead(req.user, lead)) return res.status(403).json({ success: false, message: "You cannot update this lead" });
        const data = { ...req.body };
        if (req.user.role === "SALES_EMPLOYEE") delete data.assignedTo;
        if (["SUPER_ADMIN", "ADMIN"].includes(req.user.role) && data.assignedTo) {
            const employee = await User.findById(data.assignedTo);
            if (!employee) return res.status(400).json({ success: false, message: "Assigned employee was not found" });
        }
        Object.assign(lead, data);
        await lead.save();
        res.json({ success: true, message: "Lead updated successfully", data: lead });
    } catch (error) { next(error); }
}

async function deleteLead(req, res, next) {
    try {
        const lead = await Lead.findById(req.params.id).populate("assignedTo", "name");
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        if (!canAccessLead(req.user, lead)) return res.status(403).json({ success: false, message: "You cannot delete this lead" });
        await lead.deleteOne();
        res.json({ success: true, message: "Lead deleted successfully" });
    } catch (error) { next(error); }
}

module.exports = { createLead, listLeads, getLead, updateLead, deleteLead };