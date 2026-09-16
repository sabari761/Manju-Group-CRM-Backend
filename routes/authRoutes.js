const express = require("express");
const { setupInitialAdmin, login, me } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const { loginValidator } = require("../validators/authValidator");
const { setupValidator } = require("../validators/setupValidator");

const router = express.Router();
router.post("/login", loginValidator, validationMiddleware, login);
router.post("/setup", setupValidator, validationMiddleware, setupInitialAdmin);
router.get("/me", authMiddleware, me);
module.exports = router;