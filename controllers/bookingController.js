const Booking = require("../models/Booking");
const Lead = require("../models/Lead");
const Unit = require("../models/Unit");
const Building = require("../models/Building");
const Project = require("../models/Project");

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function createBooking(req, res, next) {
    let reservedUnit;
    let createdBooking;
    try {
        const lead = await Lead.findById(req.body.leadId);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        if (req.user.role === "SALES_EMPLOYEE" && (!lead.assignedTo || lead.assignedTo.toString() !== req.user._id.toString())) return res.status(403).json({ success: false, message: "You can only book your assigned leads" });

        reservedUnit = await Unit.findOneAndUpdate({ _id: req.body.unitId, status: "AVAILABLE" }, { $set: { status: "BOOKED" } }, { new: true });
        if (!reservedUnit) return res.status(409).json({ success: false, message: "This unit has already been booked or is unavailable" });

        createdBooking = await Booking.create({ leadId: lead._id, unitId: reservedUnit._id, bookedBy: req.user._id, bookingDate: req.body.bookingDate });
        lead.stage = "Booked";
        await lead.save();
        const data = await Booking.findById(createdBooking._id).populate("leadId", "name phone").populate("bookedBy", "name email").populate({ path: "unitId", populate: { path: "buildingId", populate: { path: "projectId", select: "name location" } } });
        res.status(201).json({ success: true, message: "Booking created successfully", data });
    } catch (error) {
        if (createdBooking) await Booking.findByIdAndDelete(createdBooking._id).catch(() => {});
        if (reservedUnit) await Unit.findOneAndUpdate({ _id: reservedUnit._id }, { $set: { status: "AVAILABLE" } }).catch(() => {});
        next(error);
    }
}

async function listBookings(req, res, next) {
    try {
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
        const bookingFilter = {};

        if (!["SUPER_ADMIN", "ADMIN"].includes(req.user.role)) {
            bookingFilter.leadId = { $in: await Lead.find({ assignedTo: req.user._id }).distinct("_id") };
        }

        if (req.query.search && req.query.search.trim()) {
            const search = new RegExp(escapeRegex(req.query.search.trim()), "i");
            const [leadIds, projectIds, buildingIds, unitIds] = await Promise.all([
                Lead.find({ $or: [{ name: search }, { phone: search }, { email: search }] }).distinct("_id"),
                Project.find({ $or: [{ name: search }, { location: search }, { description: search }] }).distinct("_id"),
                Building.find({ $or: [{ name: search }, { projectId: { $in: await Project.find({ $or: [{ name: search }, { location: search }, { description: search }] }).distinct("_id") } }] }).distinct("_id"),
                Unit.find({ $or: [{ unitNumber: search }, { type: search }] }).distinct("_id")
            ]);
            const projectBuildingIds = await Building.find({ projectId: { $in: projectIds } }).distinct("_id");
            const buildingUnitIds = await Unit.find({ buildingId: { $in: [...buildingIds, ...projectBuildingIds] } }).distinct("_id");
            bookingFilter.$or = [
                { leadId: { $in: leadIds } },
                { unitId: { $in: [...unitIds, ...buildingUnitIds] } }
            ];
        }

        const [data, total] = await Promise.all([
            Booking.find(bookingFilter).populate("leadId", "name phone email stage assignedTo").populate("bookedBy", "name email role").populate({ path: "unitId", populate: { path: "buildingId", populate: { path: "projectId", select: "name location" } } }).sort({ bookingDate: -1 }).skip((page - 1) * limit).limit(limit),
            Booking.countDocuments(bookingFilter)
        ]);
        res.json({ success: true, data, total, page, limit, totalPages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
}

async function getBooking(req, res, next) {
    try {
        const data = await Booking.findById(req.params.id).populate("leadId", "name phone email stage assignedTo").populate("bookedBy", "name email role").populate({ path: "unitId", populate: { path: "buildingId", populate: { path: "projectId", select: "name location" } } });
        if (!data) return res.status(404).json({ success: false, message: "Booking not found" });
        if (!["SUPER_ADMIN", "ADMIN"].includes(req.user.role) && (!data.leadId.assignedTo || data.leadId.assignedTo.toString() !== req.user._id.toString())) return res.status(403).json({ success: false, message: "You cannot access this booking" });
        res.json({ success: true, data });
    } catch (error) { next(error); }
}

module.exports = { createBooking, listBookings, getBooking };