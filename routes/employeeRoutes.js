const express = require("express");
const controller = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const { createUserValidator, updateUserValidator } = require("../validators/userValidator");

const router = express.Router();
router.use(authMiddleware, roleMiddleware("SUPER_ADMIN", "ADMIN"));
router.get("/", controller.listEmployees);
router.post("/", createUserValidator, validationMiddleware, controller.createEmployee);
router.get("/:id", controller.getEmployee);
router.put("/:id", updateUserValidator, validationMiddleware, controller.updateEmployee);
router.delete("/:id", controller.deleteEmployee);
module.exports = router;