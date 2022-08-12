import express from "express";
const router = express.Router();
import {
  insertTrackingDetail,
  getTrackingDetail,
  getTrackingDetailById,
  deleteTrackingDetail,
  updateTrackingDetail,
  checkMaxTrackingDetail,
} from "../controllers/trackingDetailController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, admin, insertTrackingDetail)
  .get(protect, admin, getTrackingDetail);
router
  .route("/:id_tracking_detail")
  .get(protect, admin, getTrackingDetailById)
  .delete(protect, admin, deleteTrackingDetail)
  .put(protect, admin, updateTrackingDetail);

router.route("/max/id").get(protect, admin, checkMaxTrackingDetail);

export default router;
