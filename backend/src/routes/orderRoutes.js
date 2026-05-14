const express = require("express");
const orderController = require("../controllers/orderController");
const { optionalAuth, requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", optionalAuth, orderController.listOrders);
router.post("/", requireAuth, orderController.createOrder);
router.put("/:id", requireAuth, requireRole("admin"), orderController.updateOrder);
router.delete("/:id", requireAuth, requireRole("admin"), orderController.deleteOrder);

module.exports = router;
