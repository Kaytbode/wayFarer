import { Pool } from 'pg';
import 'dotenv/config';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const api = {
  async confirmUser(req, res) {
    const text = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    try {
      const { rows } = await pool.query(text, [req.body.email, req.body.password]);
      const user = rows[0];

      if (!user) {
        return res.status(404).send({
          status: 'error',
          error: 'User not found',
        });
      }

      if (user.password !== req.body.password) {
        return res.status(401).send({
          status: 'error',
          error: 'Unauthorized',
        });
      }

      return res.status(200).send({
        status: 'success',
        data: {
          user_id: user.id,
          is_admin: user.is_admin,
          token,
        },
      });
    } catch (err) {
      return res.status(400).send({
        status: 'error',
        error: err,
      });
    }
  },
};

export default api;
