const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("Building", buildingSchema);