import mysql from 'mysql';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 10,
});


pool.getConnection((err, conn) => {
  conn.query('USE MYSQL', () => {
    conn.release();
  });
});

// Returns a connection to the db
const getConnection = (callback) => {
  pool.getConnection((err, conn) => {
    callback(err, conn);
  });
};

// Helper function for querying the db; releases the db connection
// callback(err, rows)
const query = (queryString, params) => new Promise((res, rej) => {
  getConnection((err, conn) => {
    conn.query(queryString, params, (e, rows) => {
      conn.release();

      if (e) {
        return rej(e);
      }

      return res(rows);
    });
  });
});

export default { query };