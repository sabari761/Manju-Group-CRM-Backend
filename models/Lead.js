const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    stage: { type: String, enum: ["New", "Contacted", "Site Visit", "Interested", "Negotiation", "Booked", "Lost"], required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    followUpDate: Date,
    notes: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);