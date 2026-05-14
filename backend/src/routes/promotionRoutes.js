const express = require("express");
const promotionController = require("../controllers/promotionController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", promotionController.listPromotions);
router.get("/validate/:code", promotionController.validateCode);
router.post("/", requireAuth, requireRole("admin"), promotionController.createPromotion);
router.put("/:id", requireAuth, requireRole("admin"), promotionController.updatePromotion);
router.delete("/:id", requireAuth, requireRole("admin"), promotionController.deletePromotion);

module.exports = router;
