import mysql from "mysql2"

 const con = mysql.createPool({
    host:'127.0.0.1',
    port:3500,
    user:"root",
    password:"Taksh@1234",
    database:"user_information"
}).promise()
export default con

