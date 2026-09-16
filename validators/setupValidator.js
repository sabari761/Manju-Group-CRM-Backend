const { body } = require("express-validator");

const setupValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("mobileNumber").trim().notEmpty().withMessage("Mobile number is required"),
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

module.exports = { setupValidator };