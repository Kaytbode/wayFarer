import { Pool } from 'pg';

/* const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
}); */

const connectionString = 'postgres://igekybyt:bq3Fh6DILuXf7TVJqSSXIeGXGSBzncdo@otto.db.elephantsql.com:5432/igekybyt';

const pool = new Pool({
  connectionString,
});

export default pool;
