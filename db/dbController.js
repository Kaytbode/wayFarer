import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class api {
  static async createUser(req, res) {
    const {
      email, firstName, lastName, password,
    } = req.body;
    const isAdmin = false;
    const token = jwt.sign({
      firstName, email, lastName, password,
    },
    process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRY_SECONDS,
    });
    const values = [email, firstName, lastName, password, token, isAdmin];
    const text = `INSERT INTO users (email, first_name, last_name, password, token, is_admin) 
                  VALUES($1, $2, $3, $4, $5, $6) RETURNING id`;

    try {
      const { rows } = await pool.query(text, values);

      res.status(201).send({
        status: 'success',
        data: {
          user_id: rows[0].id,
          is_admin: isAdmin,
          token,
        },
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        error: err,
      });
    }
  }
}

export default api;
