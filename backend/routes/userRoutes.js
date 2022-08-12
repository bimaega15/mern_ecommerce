import path from "path";
import express from "express";
const router = express.Router();
import connect from "../config/db.js";
import syncSql from "sync-sql";
import bcrypt from "bcrypt";
import fs from "fs";
import { protect, admin } from "../middleware/authMiddleware.js";
import multer from "multer";

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { nip_users, password_users, password_users_confirm } = req.body;
    const db = connect();
    const id_users = req.params.id_users;

    var uploadError = null;
    // check type file
    const isValid = FILE_TYPE_MAP[file.mimetype];
    if (!isValid) {
      uploadError = new Error("type image tidak sesuai");
      cb(uploadError, "public/uploads/users/");
    }
    // check nip
    var unique = null;
    var sqlUnique = null;

    if (id_users == null) {
      unique = `select * from users where nip_users = ?`;
      sqlUnique = syncSql.mysql(db, unique, [nip_users]).data.rows;
    } else {
      unique = `select * from users where nip_users = ? and id_users <> ?`;

      sqlUnique = syncSql.mysql(db, unique, [nip_users, id_users]).data.rows;
    }

    if (sqlUnique.length > 0) {
      uploadError = new Error("Nip sudah digunakan sebelumnya");
      cb(uploadError, "public/uploads/users/");
    }

    if (id_users == null) {
      // check password
      if (password_users != password_users_confirm) {
        uploadError = new Error("Password tidak sesuai");
        cb(uploadError, "public/uploads/users/");
      }
    }

    cb(uploadError, "public/uploads/users/");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

import {
  getUsers,
  getUsersById,
  postUsers,
  updateUsers,
  deleteUsers,
  loginUsers,
  changePassword,
} from "../controllers/userController.js";

router.route("/").get(protect, admin, getUsers);

router.route("/:id_users").get(protect, admin, getUsersById);

router
  .route("/")
  .post(uploadOptions.single("gambar_users"), protect, admin, postUsers);

router
  .route("/:id_users")
  .put(uploadOptions.single("gambar_users"), protect, admin, updateUsers);

router.route("/:id_users").delete(protect, admin, deleteUsers);

router.route("/login").post(loginUsers);

router.route("/:id_users/changePassword").patch(protect, admin, changePassword);

export default router;
