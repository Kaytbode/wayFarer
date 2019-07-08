import { Pool } from 'pg';

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

  static async createTrip(req, res) {
    const {
      isAdmin, token, busId, origin, destination, tripDate, fare, status,
    } = req.body;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    if (!isAdmin) {
      return res.status(403).send({
        status: 'error',
        error: 'You do not have the permission to create trip',
      });
    }
    const values = [busId, origin, destination, tripDate, fare, status];
    const text = `INSERT INTO trips (bus_id, origin, destination, trip_date, fare, status) 
                  VALUES($1, $2, $3, $4, $5, $6) RETURNING id`;
    try {
      const { rows } = await pool.query(text, values);

      return res.status(201).send({
        status: 'success',
        data: {
          trip_id: rows[0].id,
          bus_id: busId,
          origin,
          destination,
          trip_date: tripDate,
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
  }

  static async getTrips(req, res) {
    const getAllTrips = 'SELECT * FROM trips';
    const { token } = req.body;

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
  }
}

export default api;
