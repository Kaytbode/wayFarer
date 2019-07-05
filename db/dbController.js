import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const api = {
  async createTrip(req, res) {
    const {
      busId, origin, dest, tripDate, fare, status, isAdmin,
    } = req.body;

    if (!isAdmin) {
      return res.status(403).send({
        status: 'error',
        error: 'You do not have the permission to create trip',
      });
    }
    const values = [busId, origin, dest, tripDate, fare, status];
    const text = `INSERT INTO trips (bus_id, origin, destination, trip_date, fare, status) 
                  VALUES($1, $2, $3, $4, $5, $6) RETURNING id`;
    try {
      const { rows } = await pool.query(text, values);

      return res.status(201).send({
        status: 'success',
        data: {
          trip_id: rows[0].id,
          busId,
          origin,
          dest,
          tripDate,
          fare,
          status,
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
