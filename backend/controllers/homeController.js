import asyncHandler from "express-async-handler";
import connect from "../config/db.js";
import syncSql from "sync-sql";

const getHome = asyncHandler(async (req, res) => {
  const db = connect();

  const id_kategori = req.query.id_kategori;
  if (id_kategori != null) {
    const sql =
      "select * from kategori where id_kategori = ? order by id_kategori desc";
    var msg = "Berhasil tampil page tracking berdasarkan kategori";
    var output = syncSql.mysql(db, sql, [id_kategori]).data.rows;
  } else {
    const sql = "select * from kategori order by id_kategori desc";
    var output = syncSql.mysql(db, sql).data.rows;
    var msg = "Berhasil tampil home page";
  }

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: msg,
      result: output,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data kosong",
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

  if (output.length == 0) {
    return res.status(400).json({
      status: 400,
      msg: "No. Bps tidak ditemukan",
    });
  }
  // search tracking detail
  const sqlDetail = `select * from tracking_detail where tracking_id = ? order by tracking_detail.id_tracking_detail desc`;
  const outputDetail = syncSql.mysql(db, sqlDetail, [output[0].id_tracking])
    .data.rows;

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan data tracking berdasarkan pencarian",
      result: {
        kategori: outputKategori,
        tracking: output,
        tracking_detail: outputDetail,
      },
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "No. Bps tidak ditemukan",
    });
  }
});

const searchHomeBps = asyncHandler(async (req, res) => {
  const db = connect();

  let no_bps_tracking = req.params.no_bps_tracking;

  // tracking
  const sql = `select * from tracking where no_bps_tracking = ?`;
  const output = syncSql.mysql(db, sql, [no_bps_tracking]).data.rows;
  if (output.length == 0) {
    return res.status(400).json({
      status: 400,
      msg: "No. Bps tidak ditemukan",
    });
  }

  // kategori
  const sqlKategori = `select * from kategori where id_kategori = ?`;
  const outputKategori = syncSql.mysql(db, sqlKategori, [output[0].kategori_id])
    .data.rows[0];

  if (output.length > 0) {
    // Tracking detail
    const sqlTrackingdetail = `select * from tracking_detail where tracking_id = ? order by id_tracking_detail desc`;
    const queryTrackingDetail = syncSql.mysql(db, sqlTrackingdetail, [
      output[0].id_tracking,
    ]).data.rows;

    const result = {
      kategori: outputKategori,
      tracking: output,
      tracking_detail: queryTrackingDetail,
    };

    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan data tracking berdasarkan pencarian no. Bps di home page",
      result,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "No. Bps tidak ditemukan",
    });
  }
});

export { getHome, searchNoBps, searchHomeBps };
