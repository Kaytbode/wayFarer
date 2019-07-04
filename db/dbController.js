import { Pool } from 'pg';
import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const api = {
  async createUser(req, res) {
    const {
      email, firstName, lastName, password,
    } = req.body;
    const values = [email, firstName, lastName, password, false];
    const text = `INSERT INTO users (email, first_name, last_name, password, is_admin) 
                  VALUES($1, $2, $3, $4, $5) RETURNING id`;

    try {
      const { rows } = await pool.query(text, values);

      res.status(201).send({
        status: 'success',
        data: {
          user_id: rows[0].id,
          is_admin: false,
          token: 'hey',
        },
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};

export default api;
