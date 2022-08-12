import asyncHandler from "express-async-handler";
import connect from "../config/db.js";
import syncSql from "sync-sql";
import mysql from "mysql";
import multer from "multer";
import bcrypt from "bcrypt";
import fs from "fs";
import generateToken from "../utils/generateToken.js";

const loginUsers = asyncHandler(async (req, res) => {
  const { nip_users, password_users } = req.body;
  const db = connect();

  //   insert
  const sql = `select * from users where nip_users = ?`;
  const output = syncSql.mysql(db, sql, [nip_users]).data.rows;

  if (output.length > 0) {
    const password = await bcrypt.compare(
      password_users,
      output[0].password_users
    );
    if (password) {
      return res.status(200).json({
        status: 200,
        msg: "Berhasil Login",
        result: output,
        token: generateToken(output[0].id_users),
      });
    } else {
      return res.status(400).json({
        status: 400,
        msg: "Password anda salah",
      });
    }
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Nip users tidak ditemukan",
    });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const db = connect();

  //   insert
  const sql = "select * from users order by id_users desc";
  const output = syncSql.mysql(db, sql).data.rows;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan user",
      result: output,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data user kosong",
    });
  }
});

const getUsersById = asyncHandler(async (req, res) => {
  const db = connect();
  const id_users = req.params.id_users;

  //   insert
  const sql = "select * from users where id_users = ? order by id_users desc";
  const output = syncSql.mysql(db, sql, [id_users]).data.rows;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan user by id",
      result: output,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data user kosong",
    });
  }
});

const postUsers = (req, res) => {
  const db = connect();
  const { nama_users, alamat_users, nohp_users, nip_users, password_users } =
    req.body;
  let basePath = "";
  if (!req.file) {
    basePath = `/users/default.png`;
  } else {
    const file = req.file;
    const fileName = file.filename;
    basePath = `/users/${fileName}`;
  }
  const gambar_users = basePath;
  //   insert
  const sql =
    "insert into users set nama_users = ?, alamat_users = ?, nohp_users = ?, nip_users = ?,password_users = ?, is_admin = true, gambar_users = ?";
  const output = syncSql.mysql(db, sql, [
    nama_users,
    alamat_users,
    nohp_users,
    nip_users,
    bcrypt.hashSync(password_users, 12),
    gambar_users,
  ]).data.rows;
  if (output.affectedRows > 0) {
    return res.status(201).json({
      status: 201,
      msg: "Berhasil tambah data users",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
};

const updateUsers = (req, res) => {
  const db = connect();
  const { nama_users, alamat_users, nohp_users, nip_users } = req.body;
  const id_users = req.params.id_users;

  // users
  const queryUsers = "select * from users where id_users = ?";
  const outputUsers = syncSql.mysql(db, queryUsers, [id_users]).data.rows;

  if (req.file != null) {
    const change_image = outputUsers[0].gambar_users;
    const split_image = change_image.split("/");
    const fix_image = split_image[split_image.length - 1];
    const filePath = "./public/uploads/users/" + fix_image;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  let basePath = "";
  if (!req.file) {
    basePath = `/users/default.png`;
  } else {
    const file = req.file;
    const fileName = file.filename;
    basePath = `/users/${fileName}`;
  }

  const gambar_users = basePath;
  //   update
  const sql =
    "UPDATE users SET nama_users = ?, alamat_users = ?, nohp_users = ?, nip_users = ?, gambar_users = ?  WHERE id_users = ?";
  const output = syncSql.mysql(db, sql, [
    nama_users,
    alamat_users,
    nohp_users,
    nip_users,
    gambar_users,
    id_users,
  ]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(200).json({
      status: 200,
      msg: "Berhasil ubah data users",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
};

const changePassword = (req, res) => {
  const db = connect();
  const { password_lama, password_baru, konfirmasi_password_baru } = req.body;
  const id_users = req.params.id_users;

  // Validate password
  if (password_baru !== konfirmasi_password_baru) {
    return res.status(400).json({
      status: 400,
      msg: "Password anda tidak sesuai",
    });
  }

  // validate password users
  const queryUsers = "select * from users where id_users = ?";
  const outputUsers = syncSql.mysql(db, queryUsers, [id_users]).data.rows[0];
  const password_users = outputUsers.password_users;

  const verified = bcrypt.compareSync(password_lama, password_users);
  if (!verified) {
    return res.status(400).send({
      status: 400,
      msg: "Password lama tidak sesuai",
    });
  }

  //   update
  const sql = "UPDATE users SET password_users = ?  WHERE id_users = ?";
  const output = syncSql.mysql(db, sql, [
    bcrypt.hashSync(password_baru, 12),
    id_users,
  ]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(200).json({
      status: 200,
      msg: "Berhasil ubah password",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
};

const deleteUsers = (req, res) => {
  const db = connect();

  // users
  const id_users = req.params.id_users;
  const query = "select * from users where id_users = ?";
  const connUsers = syncSql.mysql(db, query, [id_users]).data.rows[0];

  const file = connUsers.gambar_users;
  if (file != null) {
    const change_image = file;
    const split_image = change_image.split("/");
    const fix_image = split_image[split_image.length - 1];
    const filePath = "./public/uploads/users/" + fix_image;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  //   delete
  const sql = "DELETE from users WHERE id_users = ?";
  const output = syncSql.mysql(db, sql, [id_users]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(200).json({
      status: 200,
      msg: "Berhasil hapus data users",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
};

export {
  getUsers,
  getUsersById,
  postUsers,
  updateUsers,
  deleteUsers,
  loginUsers,
  changePassword,
};
