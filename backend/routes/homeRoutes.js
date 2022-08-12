import express from "express";
const router = express.Router();
import {
  getHome,
  searchHomeBps,
  searchNoBps,
} from "../controllers/homeController.js";

router.route("/").get(getHome);
router.route("/:search/search").get(searchNoBps);
router.route("/searchHomeBps/:no_bps_tracking").get(searchHomeBps);

export default router;
