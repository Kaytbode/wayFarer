import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const api = {
  async getTrips(req, res) {
    const getAllTrips = 'SELECT * FROM trips';
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    try {
      const { rows } = await pool.query(getAllTrips);

      return res.status(200).send({
        status: 'success',
        data: rows,
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
