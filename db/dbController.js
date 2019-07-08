import { Pool } from 'pg';
import 'dotenv/config';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class api {
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
