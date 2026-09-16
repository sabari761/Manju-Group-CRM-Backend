const express = require("express");
const controller = require("../controllers/leadController");
const authMiddleware = require("../middleware/authMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const { leadValidator } = require("../validators/leadValidator");

const router = express.Router();
router.use(authMiddleware);
router.route("/").get(controller.listLeads).post(leadValidator, validationMiddleware, controller.createLead);
router.route("/:id").get(controller.getLead).put(leadValidator, validationMiddleware, controller.updateLead).delete(controller.deleteLead);
module.exports = router;