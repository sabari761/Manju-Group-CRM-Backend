const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingDate: { type: Date, required: true }
}, { timestamps: true });

bookingSchema.index({ unitId: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);