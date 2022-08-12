import db from './db.js';
const tableTracking = () => {
    const conn = db();
    conn.connect(function(err){
        if(err) throw err;
    
        let sql = `CREATE TABLE tracking 
        (
            id_tracking int NOT NULL AUTO_INCREMENT,
            no_bps varchar(100) not null,
            tanggal date not null,
            status_tracking enum('permohonan','proses penelitian','pencetakan Pbk','penolakan Pbk','pengiriman Pbk') not null,
            kategori_id int not null,
            FOREIGN KEY (kategori_id) REFERENCES kategori(id_kategori) ON DELETE CASCADE ON UPDATE CASCADE,
            PRIMARY KEY (id_tracking)
        )`;

        conn.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table tracking created");
        });
    })
}
export default tableTracking;