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

  static async confirmUser(req, res) {
    const text = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const { email, password } = req.body;

    try {
      const { rows } = await pool.query(text, [email, password]);
      const user = rows[0];

      if (!user) {
        return res.status(401).send({
          status: 'error',
          error: 'User not found',
        });
      }

      return res.status(200).send({
        status: 'success',
        data: {
          user_id: user.id,
          is_admin: user.is_admin,
          token: user.token,
        },
      });
    } catch (err) {
      return res.status(400).send({
        status: 'error',
        error: err,
      });
    }
  }
}

export default api;
