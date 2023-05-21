const mysql=require('mysql');
const db=mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'1234',
  database:'first_table',
})
module.exports=db;