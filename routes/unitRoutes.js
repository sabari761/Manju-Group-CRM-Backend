const express = require("express");
const controller = require("../controllers/unitController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const { unitValidator } = require("../validators/propertyValidator");

const router = express.Router();
router.use(authMiddleware);
router.get("/buildings/:buildingId/units", controller.listUnits);
router.post("/buildings/:buildingId/units", roleMiddleware("ADMIN"), unitValidator, validationMiddleware, controller.createUnit);
router.put("/units/:id", roleMiddleware("ADMIN"), unitValidator, validationMiddleware, controller.updateUnit);
router.delete("/units/:id", roleMiddleware("ADMIN"), controller.deleteUnit);
module.exports = router;