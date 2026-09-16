const express = require("express");
const controller = require("../controllers/buildingController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const { buildingValidator } = require("../validators/propertyValidator");

const router = express.Router();
router.use(authMiddleware);
router.get("/projects/:projectId/buildings", controller.listBuildings);
router.post("/projects/:projectId/buildings", roleMiddleware("ADMIN"), buildingValidator, validationMiddleware, controller.createBuilding);
router.put("/buildings/:id", roleMiddleware("ADMIN"), buildingValidator, validationMiddleware, controller.updateBuilding);
router.delete("/buildings/:id", roleMiddleware("ADMIN"), controller.deleteBuilding);
module.exports = router;