import db from './db.js';
const tableTrackingDetail = () => {
    const conn = db();
    conn.connect(function(err){
        if(err) throw err;
    
        let sql = `CREATE TABLE tracking_detail 
        (
            id_tracking_detail int NOT NULL AUTO_INCREMENT,
            judul_tracking_detail varchar(200) not null,
            keterangan_tracking_detail text not null,
            tanggal_tracking_detail date not null,
            tracking_id int not null,
            FOREIGN KEY (tracking_id) REFERENCES tracking(id_tracking) ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY (id_tracking_detail)
        )`;

        conn.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table tracking detail created");
        });
    })
}
export default tableTrackingDetail;