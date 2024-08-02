const { Router } = require("express");
const {
  AuthController,
  authenticateToken,
} = require("../controllers/auth_controller");
const { ParentController } = require("../controllers/parent_controller");

const router = Router();

router.post("/login", AuthController.getConnected);
router.post("/logout", authenticateToken, AuthController.getDisconnected);
router.post("/parent", ParentController.postNewParent);
router.get("/parent/:id", authenticateToken, ParentController.getParentById);

module.exports = { router };
