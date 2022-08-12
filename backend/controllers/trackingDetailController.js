import asyncHandler from "express-async-handler";
import connect from "../config/db.js";
import syncSql from "sync-sql";
import mysql from "mysql";

const checkMaxTrackingDetail = asyncHandler(async (req, res) => {
  const db = connect();
  //   check max
  const sqlTrackingDetail =
    "select max(id_tracking_detail) as id_tracking_detail from tracking_detail";
  const checkTrackingDetail = syncSql.mysql(db, sqlTrackingDetail).data.rows;

  return checkTrackingDetail.id_tracking_detail;
});

const insertTrackingDetail = asyncHandler(async (req, res) => {
  const id_tracking = req.query.id_tracking;
  const {
    keterangan_tracking_detail,
    tanggal_tracking_detail,
    status_tracking_detail,
  } = req.body;
  const db = connect();

  //   check unique
  const sqlTrackingDetail =
    "select * from tracking_detail where status_tracking_detail = ? and tracking_id = ?";

  const checkTrackingDetail = syncSql.mysql(db, sqlTrackingDetail, [
    status_tracking_detail,
    id_tracking,
  ]).data.rows.length;

  if (checkTrackingDetail > 0) {
    return res.status(400).json({
      status: 400,
      msg: "Status ini sebelumnya sudah diinputkan",
    });
  }

  //   insert
  const sql =
    "insert into tracking_detail set tanggal_tracking_detail = ?, keterangan_tracking_detail = ?, status_tracking_detail = ?, tracking_id = ?";
  const output = syncSql.mysql(db, sql, [
    tanggal_tracking_detail,
    keterangan_tracking_detail,
    status_tracking_detail,
    id_tracking,
  ]).data.rows;

  if (output.affectedRows > 0) {
    // update status
    const sqlTracking =
      "UPDATE tracking SET status_tracking = ? WHERE id_tracking = ?";
    syncSql.mysql(db, sqlTracking, [status_tracking_detail, id_tracking]);

    return res.status(201).json({
      status: 201,
      msg: "Berhasil tambah data Tracking Detail",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

const getTrackingDetail = asyncHandler(async (req, res) => {
  const db = connect();
  const id_tracking = req.query.id_tracking;

  // Tracking
  const sqlTracking = "select * from tracking where id_tracking = ?";
  const outputTracking = syncSql.mysql(db, sqlTracking, [id_tracking]).data
    .rows[0];

  // Kategori
  const sqlKategori = "select * from kategori where id_kategori = ?";
  const outputKategori = syncSql.mysql(db, sqlKategori, [
    outputTracking.kategori_id,
  ]).data.rows[0];

  const sql =
    "select * from tracking_detail where tracking_id = ? order by id_tracking_detail desc";
  const output = syncSql.mysql(db, sql, [id_tracking]).data.rows;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan tracking detail",
      result: {
        kategori: outputKategori,
        tracking: outputTracking,
        tracking_detail: output,
      },
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data tracking detail kosong",
    });
  }
});

const getTrackingDetailById = asyncHandler(async (req, res) => {
  const db = connect();
  const id_tracking_detail = req.params.id_tracking_detail;

  const sql = "select * from tracking_detail where id_tracking_detail = ?";
  const output = syncSql.mysql(db, sql, [id_tracking_detail]).data.rows;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan tracking detail by id",
      result: output,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data tracking detail kosong",
    });
  }
});

const deleteTrackingDetail = asyncHandler(async (req, res) => {
  const db = connect();
  const id_tracking_detail = req.params.id_tracking_detail;

  const sql = "DELETE from tracking_detail WHERE id_tracking_detail = ?";
  const output = syncSql.mysql(db, sql, [id_tracking_detail]).data.rows;

  if (output.affectedRows > 0) {
    // get max id_tracking_detail
    const sqlTrackingDetail =
      "select max(id_tracking_detail) as id_tracking_detail from tracking_detail";
    const maxIdTrackingDetail = syncSql.mysql(db, sqlTrackingDetail).data
      .rows[0].id_tracking_detail;

    // update status tracking
    const id_tracking_detail = maxIdTrackingDetail;
    const sql = "select * from tracking_detail where id_tracking_detail = ?";
    const output = syncSql.mysql(db, sql, [id_tracking_detail]).data.rows[0];
    const status_tracking_detail = output.status_tracking_detail;
    const tracking_id = output.tracking_id;

    // update status
    const sqlTracking =
      "UPDATE tracking SET status_tracking = ? WHERE id_tracking = ?";
    const queryTracking = syncSql.mysql(db, sqlTracking, [
      status_tracking_detail,
      tracking_id,
    ]);

    return res.status(200).send({
      status: 200,
      msg: "Berhasil menghapus data Tracking Detail",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

const updateTrackingDetail = asyncHandler(async (req, res) => {
  const {
    keterangan_tracking_detail,
    tanggal_tracking_detail,
    status_tracking_detail,
  } = req.body;
  const db = connect();
  const id_tracking_detail = req.params.id_tracking_detail;
  const tracking_id = req.query.id_tracking;

  //   check unique
  const sqlTrackingDetail =
    "select * from tracking_detail where status_tracking_detail = ? and id_tracking_detail <> ?";
  const checkTrackingDetail = syncSql.mysql(db, sqlTrackingDetail, [
    status_tracking_detail,
    id_tracking_detail,
  ]).data.rows.length;
  if (checkTrackingDetail > 0) {
    return res.status(400).json({
      status: 400,
      msg: "Status ini sebelulmnya sudah diinput",
    });
  }

  const sql =
    "UPDATE tracking_detail SET keterangan_tracking_detail = ?, tanggal_tracking_detail = ?, status_tracking_detail = ?, tracking_id = ?  WHERE id_tracking_detail = ?";
  const output = syncSql.mysql(db, sql, [
    keterangan_tracking_detail,
    tanggal_tracking_detail,
    status_tracking_detail,
    tracking_id,
    id_tracking_detail,
  ]).data.rows;

  if (output.affectedRows > 0) {
    // get max id_tracking_detail
    const sqlTrackingDetail =
      "select max(id_tracking_detail) as id_tracking_detail from tracking_detail";
    const maxIdTrackingDetail = syncSql.mysql(db, sqlTrackingDetail).data
      .rows[0].id_tracking_detail;

    // update status tracking
    const id_tracking_detail = maxIdTrackingDetail;
    const sql = "select * from tracking_detail where id_tracking_detail = ?";
    const output = syncSql.mysql(db, sql, [id_tracking_detail]).data.rows[0];
    const status_tracking_detail = output.status_tracking_detail;
    const tracking_id = output.tracking_id;

    // update status
    const sqlTracking =
      "UPDATE tracking SET status_tracking = ? WHERE id_tracking = ?";
    const queryTracking = syncSql.mysql(db, sqlTracking, [
      status_tracking_detail,
      tracking_id,
    ]);

    return res.status(200).send({
      status: 200,
      msg: "Berhasil update data Tracking Detail",
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Terjadi kesalahan",
    });
  }
});

export {
  insertTrackingDetail,
  getTrackingDetail,
  getTrackingDetailById,
  deleteTrackingDetail,
  updateTrackingDetail,
  checkMaxTrackingDetail,
};
