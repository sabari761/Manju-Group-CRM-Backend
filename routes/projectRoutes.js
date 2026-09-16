const express = require("express");
const controller = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const validationMiddleware = require("../middleware/validationMiddleware");
const { projectValidator } = require("../validators/propertyValidator");

const router = express.Router();
router.use(authMiddleware);
router.get("/", controller.listProjects);
router.post("/", roleMiddleware("ADMIN"), projectValidator, validationMiddleware, controller.createProject);
router.get("/:id", controller.getProject);
router.put("/:id", roleMiddleware("ADMIN"), projectValidator, validationMiddleware, controller.updateProject);
router.delete("/:id", roleMiddleware("ADMIN"), controller.deleteProject);
module.exports = router;