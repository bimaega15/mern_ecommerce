import asyncHandler from "express-async-handler";
import connect from "../config/db.js";
import syncSql from "sync-sql";
import fs from "fs";

const insertKategori = asyncHandler(async (req, res) => {
  const { nama_kategori } = req.body;
  const db = connect();

  const file = req.file;
  const fileName = file.filename;
  let basePath = "";
  if (!file) {
    basePath = `/kategori/default.png`;
  } else {
    basePath = `/kategori/${fileName}`;
  }

  const sql = "insert into kategori set nama_kategori = ?, gambar_kategori= ?";
  const output = syncSql.mysql(db, sql, [nama_kategori, basePath]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(201).json({
      status: 201,
      msg: "Berhasil tambah data kategori",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

const getKategori = asyncHandler(async (req, res) => {
  const db = connect();

  const sql = "select * from kategori";
  const output = syncSql.mysql(db, sql).data.rows;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan kategori",
      result: output,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data kategori kosong",
    });
  }
});

const getKategoriById = asyncHandler(async (req, res) => {
  const db = connect();
  const id_kategori = req.params.id_kategori;

  const sql = "select * from kategori where id_kategori = ?";
  const output = syncSql.mysql(db, sql, [id_kategori]).data.rows;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan kategori by id",
      result: output,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data kategori by id kosong",
    });
  }
});

const deleteKategori = asyncHandler(async (req, res) => {
  const db = connect();
  const id_kategori = req.params.id_kategori;

  const sqlKategori = "select * from kategori where id_kategori = ?";
  const outputKategori = syncSql.mysql(db, sqlKategori, [id_kategori]).data
    .rows[0];
  const file = outputKategori.gambar_kategori;
  if (file != null) {
    // file
    const change_image = outputKategori.gambar_kategori;
    const split_image = change_image.split("/");
    const fix_image = split_image[split_image.length - 1];
    const filePath = "./public/uploads/kategori/" + fix_image;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const sql = "DELETE FROM kategori WHERE id_kategori = ?";
  const output = syncSql.mysql(db, sql, [id_kategori]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menghapus data kategori",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

const updateKategori = asyncHandler(async (req, res) => {
  const { nama_kategori } = req.body;
  const db = connect();
  const id_kategori = req.params.id_kategori;

  const sqlKategori = "select * from kategori where id_kategori = ?";
  const outputKategori = syncSql.mysql(db, sqlKategori, [id_kategori]).data
    .rows[0];

  // file
  if (req.file != null) {
    const change_image = outputKategori.gambar_kategori;
    const split_image = change_image.split("/");
    const fix_image = split_image[split_image.length - 1];
    const filePath = "./public/uploads/kategori/" + fix_image;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  let basePath = "";
  if (!req.file) {
    basePath = `/kategori/default.png`;
  } else {
    const fileName = req.file.filename;
    basePath = `/kategori/${fileName}`;
  }

  const gambar_kategori = basePath;
  const sql =
    "UPDATE kategori SET nama_kategori = ?, gambar_kategori = ? WHERE id_kategori = ?";
  const output = syncSql.mysql(db, sql, [
    nama_kategori,
    gambar_kategori,
    id_kategori,
  ]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil update data kategori",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

export {
  insertKategori,
  getKategori,
  getKategoriById,
  deleteKategori,
  updateKategori,
};
