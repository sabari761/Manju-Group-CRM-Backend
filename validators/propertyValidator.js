const { body } = require("express-validator");

const projectValidator = [body("name").trim().notEmpty().withMessage("Project name is required"), body("location").trim().notEmpty().withMessage("Location is required")];
const buildingValidator = [body("name").trim().notEmpty().withMessage("Building name is required")];
const unitValidator = [
    body("unitNumber").trim().notEmpty().withMessage("Unit number is required"),
    body("type").isIn(["1BHK", "2BHK", "3BHK"]).withMessage("Unit type is invalid"),
    body("price").isFloat({ min: 0.01 }).withMessage("Price must be greater than 0"),
    body("status").optional().isIn(["AVAILABLE", "BOOKED"]).withMessage("Unit status is invalid")
];

module.exports = { projectValidator, buildingValidator, unitValidator };