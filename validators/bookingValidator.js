const { body } = require("express-validator");

const bookingValidator = [
    body("leadId").isMongoId().withMessage("Valid leadId is required"),
    body("unitId").isMongoId().withMessage("Valid unitId is required"),
    body("bookingDate").isISO8601().withMessage("Booking date must be a valid date")
];

module.exports = { bookingValidator };