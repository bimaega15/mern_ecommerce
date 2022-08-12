import express from "express";
const router = express.Router();
import {
  insertTracking,
  getTracking,
  getTrackingById,
  deleteTracking,
  updateTracking,
  searchNoBps,
} from "../controllers/trackingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, admin, insertTracking)
  .get(protect, admin, getTracking);

router
  .route("/:id_tracking")
  .get(protect, admin, getTrackingById)
  .delete(protect, admin, deleteTracking)
  .put(protect, admin, updateTracking);

router.route("/:search/search").get(searchNoBps);

export default router;
