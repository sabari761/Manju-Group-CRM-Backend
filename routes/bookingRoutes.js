const express = require("express");
const controller = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const { bookingValidator } = require("../validators/bookingValidator");

const router = express.Router();
router.use(authMiddleware);
router.get("/", controller.listBookings);
router.post("/", bookingValidator, validationMiddleware, controller.createBooking);
router.get("/:id", controller.getBooking);
module.exports = router;