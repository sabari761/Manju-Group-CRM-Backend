const Lead = require("../models/Lead");
const Booking = require("../models/Booking");

async function getDashboard(req, res, next) {
    try {
        const leadFilter = ["SUPER_ADMIN", "ADMIN"].includes(req.user.role) ? {} : { assignedTo: req.user._id };
        const [leads, bookings] = await Promise.all([Lead.find(leadFilter).select("stage followUpDate"), Booking.find().populate("leadId", "assignedTo")]);
        const visibleBookings = ["SUPER_ADMIN", "ADMIN"].includes(req.user.role) ? bookings : bookings.filter((booking) => booking.leadId && booking.leadId.assignedTo && booking.leadId.assignedTo.toString() === req.user._id.toString());
        const today = new Date();
        const followUpsToday = leads.filter((lead) => lead.followUpDate && new Date(lead.followUpDate).toDateString() === today.toDateString()).length;
        const data = { totalLeads: leads.length, newLeads: 0, contactedLeads: 0, siteVisitLeads: 0, interestedLeads: 0, negotiationLeads: 0, bookedLeads: 0, lostLeads: 0, followUpsToday, totalBookings: visibleBookings.length };
        leads.forEach((lead) => { const key = `${lead.stage.toLowerCase().replace(" ", "")}Leads`; if (key in data) data[key] += 1; });
        res.json({ success: true, data });
    } catch (error) { next(error); }
}

module.exports = { getDashboard };