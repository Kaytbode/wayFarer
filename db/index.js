import { Pool } from 'pg';

// Heroku database

/* const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
}); */

/*
elephantSql needed for travis-ci config
heroku was not connecting
*/
const connectionString = process.env.DB;

const pool = new Pool({
  connectionString,
});

export default pool;
