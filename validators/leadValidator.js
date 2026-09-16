const { body } = require("express-validator");

const stages = ["New", "Contacted", "Site Visit", "Interested", "Negotiation", "Booked", "Lost"];
const leadValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
    body("email").optional({ values: "falsy" }).isEmail().withMessage("Email must be valid"),
    body("stage").isIn(stages).withMessage("Stage is invalid"),
    body("followUpDate").optional({ values: "falsy" }).isISO8601().withMessage("Follow-up date must be a valid date")
];

module.exports = { leadValidator, stages };