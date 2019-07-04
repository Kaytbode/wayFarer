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
    const admin = false;
    const values = [email, firstName, lastName, password, admin];
    const text = `INSERT INTO users (email, first_name, last_name, password, is_admin) 
                  VALUES($1, $2, $3, $4, $5) RETURNING id`;

    const token = jsonwebtoken.sign({ user: `${firstName}${lastName}` }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRY_SECONDS,
    });

    try {
      const { rows } = await pool.query(text, values);

      res.cookie('token', token, { maxAge: process.env.EXPIRY_SECONDS * 1000 });

      res.status(201).send({
        status: 'success',
        data: {
          user_id: rows[0].id,
          is_admin: admin,
          token,
        },
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },
};

export default api;
