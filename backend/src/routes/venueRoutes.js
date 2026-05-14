const express = require("express");
const venueController = require("../controllers/venueController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", venueController.listVenues);
router.post("/", requireAuth, requireRole("admin", "organizer"), venueController.createVenue);
router.put("/:id", requireAuth, requireRole("admin", "organizer"), venueController.updateVenue);
router.delete("/:id", requireAuth, requireRole("admin", "organizer"), venueController.deleteVenue);

module.exports = router;
