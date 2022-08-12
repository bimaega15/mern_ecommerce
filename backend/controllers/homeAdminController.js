import asyncHandler from "express-async-handler";
import connect from "../config/db.js";
import syncSql from "sync-sql";

const getHomeAdmin = asyncHandler(async (req, res) => {
  const db = connect();
  const sql = "select * from kategori order by id_kategori asc";
  var output = syncSql.mysql(db, sql).data.rows;

  var outputFix = [];
  output.forEach(function (currentValue, index) {
    const sqlRows = `select count(tracking.id_tracking) as jumlah_data from tracking where kategori_id = ${currentValue.id_kategori}`;
    var outputRows = syncSql.mysql(db, sqlRows).data.rows[0].jumlah_data;

    outputFix.push({
      id_kategori: currentValue.id_kategori,
      nama_kategori: currentValue.nama_kategori,
      gambar_kategori: currentValue.gambar_kategori,
      jumlah_data: outputRows,
    });
  });

  if (output.length > 0) {
    return res.status(200).send({
      status: 200,
      msg: "Berhasil menampilkan home admin",
      result: outputFix,
    });
  } else {
    return res.status(400).json({
      status: 400,
      msg: "Data kosong",
    });
  }
});

export { getHomeAdmin };
