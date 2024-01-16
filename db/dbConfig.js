const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port:3306
  // connectionLimit: 10,
});

// console.log(process.env.PASSWORD);

// dbConnection.execute("SELECT 'test'", (error, result) => {
//   if (error) {
//     console.log(error.message);
//   } else {
//     console.log(result);
//   }
// });

module.exports = dbConnection.promise();
