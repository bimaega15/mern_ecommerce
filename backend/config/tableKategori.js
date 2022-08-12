import db from './db.js';
const tableKategori = () => {
    const conn = db();
    conn.connect(function(err){
        if(err) throw err;
    
        let sql = `CREATE TABLE kategori 
        (
            id_kategori int NOT NULL AUTO_INCREMENT,
            nama_kategori varchar(255) not null,
            PRIMARY KEY (id_kategori)
        )`;

        conn.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table kategori created");
        });
    })
}
export default tableKategori;