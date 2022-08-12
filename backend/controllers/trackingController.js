import asyncHandler from "express-async-handler";
import connect from "../config/db.js";
import syncSql from "sync-sql";
import mysql from "mysql";

const insertTracking = asyncHandler(async (req, res) => {
  const { tanggal_tracking, no_bps_tracking } = req.body;
  const id_kategori = req.query.id_kategori;
  const db = connect();

  //   check unique
  const sqlTracking = "select * from tracking where no_bps_tracking = ?";
  const checkTracking = syncSql.mysql(db, sqlTracking, [no_bps_tracking]).data
    .rows.length;
  if (checkTracking > 0) {
    return res.status(400).json({
      status: 400,
      msg: "No. BPS harus unique",
    });
  }

  //   insert
  const sql =
    "insert into tracking set no_bps_tracking = ?, tanggal_tracking = ?, kategori_id = ?";
  const output = syncSql.mysql(db, sql, [
    no_bps_tracking,
    tanggal_tracking,
    id_kategori,
  ]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(201).json({
      status: 201,
      msg: "Berhasil tambah data tracking",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

const getTracking = asyncHandler(async (req, res) => {
  const db = connect();
  const id_kategori = req.query.id_kategori;

  const sqlKategori = "select * from kategori where id_kategori = ?";
  const outputKategori = syncSql.mysql(db, sqlKategori, [id_kategori]).data
    .rows;

  const sql =
    "select * from tracking where kategori_id = ? order by id_tracking desc";
  const output = syncSql.mysql(db, sql, [id_kategori]).data.rows;

  const tracking = output;
  const kategori = outputKategori;
  const rows = output.length;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan data tracking",
      result: {
        tracking,
        kategori,
        rows,
      },
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data tracking kosong",
    });
  }
});

const getTrackingById = asyncHandler(async (req, res) => {
  const db = connect();
  const id_tracking = req.params.id_tracking;

  const sql = "select * from tracking where id_tracking = ?";
  const output = syncSql.mysql(db, sql, [id_tracking]).data.rows;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan kategori by id",
      result: output,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data tracking by id kosong",
    });
  }
});

const deleteTracking = asyncHandler(async (req, res) => {
  const db = connect();
  const id_tracking = req.params.id_tracking;

  const sql = "DELETE FROM tracking WHERE id_tracking = ?";
  const output = syncSql.mysql(db, sql, [id_tracking]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menghapus data tracking",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

const updateTracking = asyncHandler(async (req, res) => {
  const { tanggal_tracking, no_bps_tracking } = req.body;
  const db = connect();
  const id_tracking = req.params.id_tracking;

  //   check unique
  const sqlTracking =
    "select * from tracking where no_bps_tracking = ? and id_tracking <> ?";
  const checkTracking = syncSql.mysql(db, sqlTracking, [
    no_bps_tracking,
    id_tracking,
  ]).data.rows.length;

  if (checkTracking > 0) {
    return res.status(400).json({
      status: 400,
      msg: "No. BPS harus unique",
    });
  }

  const sql =
    "UPDATE tracking SET tanggal_tracking = ?, no_bps_tracking = ?  WHERE id_tracking = ?";
  const output = syncSql.mysql(db, sql, [
    tanggal_tracking,
    no_bps_tracking,
    id_tracking,
  ]).data.rows;

  if (output.affectedRows > 0) {
    return res.status(201).send({
      status: 200,
      msg: "Berhasil update data tracking",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

const searchNoBps = asyncHandler(async (req, res) => {
  const db = connect();

  let search = req.params.search;
  const id_kategori = req.query.id_kategori;
  // kategori
  const sqlKategori = `select * from kategori where id_kategori = ?`;
  const outputKategori = syncSql.mysql(db, sqlKategori, [id_kategori]).data
    .rows;
  // search no bps
  const sql = `select * from tracking where no_bps_tracking like ? and kategori_id = ? order by id_tracking desc`;
  const output = syncSql.mysql(db, sql, [`%${search}%`, id_kategori]).data.rows;
  // search tracking detail
  const sqlDetail = `select * from tracking_detail where tracking_id = ? order by tracking_detail.id_tracking_detail desc`;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan data tracking berdasarkan pencarian",
      result: {
        kategori: outputKategori,
        tracking: output,
        rows: output.length,
      },
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "No. Bps tidak ditemukan",
    });
  }
});

export {
  insertTracking,
  getTracking,
  getTrackingById,
  deleteTracking,
  updateTracking,
  searchNoBps,
};
