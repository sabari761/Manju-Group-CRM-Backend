const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
    unitNumber: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    price: { type: Number, required: true, min: 0.01 },
    status: { type: String, enum: ["AVAILABLE", "BOOKED"], default: "AVAILABLE" }
}, { timestamps: true });

unitSchema.index({ buildingId: 1, unitNumber: 1 }, { unique: true });

module.exports = mongoose.model("Unit", unitSchema);