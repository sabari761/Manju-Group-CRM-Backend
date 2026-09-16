const { body } = require("express-validator");

const userFields = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("mobileNumber").trim().notEmpty().withMessage("Mobile number is required"),
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("role").isIn(["SUPER_ADMIN", "ADMIN", "LIMITED_ADMIN", "SALES_EMPLOYEE"]).withMessage("Role is invalid")
];

const createUserValidator = [
    ...userFields,
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

const updateUserValidator = [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("mobileNumber").optional().trim().notEmpty().withMessage("Mobile number cannot be empty"),
    body("email").optional().isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("role").optional().isIn(["SUPER_ADMIN", "ADMIN", "LIMITED_ADMIN", "SALES_EMPLOYEE"]).withMessage("Role is invalid"),
    body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

module.exports = { createUserValidator, updateUserValidator };