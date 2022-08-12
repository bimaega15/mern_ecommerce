import mysql from "mysql";

const connect = () => {
  const config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "api_pajak",
    dateStrings: true,
  };
  // let con = mysql.createConnection(config);
  return config;
};

export default connect;
