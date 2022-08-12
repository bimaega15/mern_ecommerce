import db from './db.js';
const tableUsers = () => {
    const conn = db();
    conn.connect(function(err){
        if(err) throw err;
    
        let sql = `CREATE TABLE users 
        (
            id_users int NOT NULL AUTO_INCREMENT,
            nama_users varchar(255) not null, 
            alamat_users text not null,
            nohp_users varchar(30) not null,
            nip_users int not null,
            password_users varchar(255) not null,
            is_admin boolean default false,
            gambar_users varchar(255) default null,
            PRIMARY KEY (id_users)
        )`;

        conn.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table users created");
        });
    })
}
export default tableUsers;