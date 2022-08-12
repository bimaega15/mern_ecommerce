import express from "express";
const router = express.Router();
import { getHomeAdmin } from "../controllers/homeAdminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(protect, admin, getHomeAdmin);

export default router;
