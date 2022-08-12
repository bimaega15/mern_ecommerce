import express from "express";
const router = express.Router();
import {
  insertKategori,
  getKategori,
  getKategoriById,
  deleteKategori,
  updateKategori,
} from "../controllers/kategoriController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import multer from "multer";

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads/kategori");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router
  .route("/")
  .post(uploadOptions.single("gambar_kategori"), protect, admin, insertKategori)
  .get(protect, admin, getKategori);
router
  .route("/:id_kategori")
  .get(protect, admin, getKategoriById)
  .delete(protect, admin, deleteKategori)
  .put(uploadOptions.single("gambar_kategori"), protect, admin, updateKategori);

export default router;
