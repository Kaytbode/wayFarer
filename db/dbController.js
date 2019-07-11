import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import moment from 'moment';

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

      return res.status(201).send({
        status: 'success',
        data: {
          user_id: rows[0].id,
          is_admin: isAdmin,
          token,
        },
      });
    } catch (err) {
      return res.status(400).send({
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

    if (!JSON.parse(isAdmin)) {
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

  static async bookASeat(req, res) {
    const {
      email, firstName, lastName, tripId, userId, busId, token, tripDate, seatNumber,
    } = req.body;

    const createdOn = moment().format('YYYY-MM-DD');
    const values = [tripId, userId, createdOn, busId, tripDate, seatNumber, email];
    const text = `INSERT INTO booking (trip_id, user_id, created_on, bus_id, trip_date, seat_number, email)
     VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    try {
      const { rows } = await pool.query(text, values);

      return res.status(201).send({
        status: 'success',
        data: {
          booking_id: rows[0].id,
          user_id: userId,
          trip_id: tripId,
          bus_id: busId,
          trip_date: tripDate,
          seat_number: seatNumber,
          first_name: firstName,
          last_name: lastName,
          email,
        },
      });
    } catch (err) {
      return res.status(400).send({
        status: 'error',
        error: err,
      });
    }
  }

  static async viewBookings(req, res) {
    const { token, isAdmin, userId } = req.body;
    const myBookings = {
      text: 'SELECT * FROM booking WHERE user_id = $1',
      values: [userId],
    };

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    const bookings = JSON.parse(isAdmin) ? 'SELECT * FROM booking' : myBookings;

    try {
      const { rows } = await pool.query(bookings);


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

  static async deleteBookings(req, res) {
    const { token, userId } = req.body;
    const { bookingId } = req.params;
    const myBookings = {
      text: 'DELETE FROM booking WHERE user_id = $1 AND id = $2 RETURNING *',
      values: [+userId, +bookingId],
    };

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    if (!userId) {
      return res.status(400).send({
        status: 'error',
        error: 'UserId missing',
      });
    }

    try {
      const { rows } = await pool.query(myBookings);

      return res.status(200).send({
        status: 'success',
        data: {
          message: 'Booking deleted successfully',
          booking_id: rows[0].id,
          id: rows[0].user_id,
          trip_id: rows[0].trip_id,
          bus_id: rows[0].bus_id,
        },
      });
    } catch (err) {
      return res.status(400).send({
        status: 'error',
        error: err,
      });
    }
  }

  static async cancelTrip(req, res) {
    const { token, isAdmin } = req.body;
    const { tripId } = req.params;
    const trip = {
      text: 'UPDATE trips SET status = $1 WHERE id = $2 RETURNING *',
      values: ['cancelled', +tripId],
    };

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    if (!JSON.parse(isAdmin)) {
      return res.status(403).send({
        status: 'error',
        error: 'You do not have the permission to cancel trips',
      });
    }

    try {
      const { rows } = await pool.query(trip);

      return res.status(200).send({
        status: 'success',
        data: {
          message: 'Trip cancelled successfully',
          status: rows[0].status,
          trip_id: rows[0].trip_id,
          bus_id: rows[0].bus_id,
          origin: rows[0].origin,
          destination: rows[0].destination,
        },
      });
    } catch (err) {
      return res.status(400).send({
        status: 'error',
        error: err,
      });
    }
  }

  static async getTripsByDest(req, res) {
    const { token } = req.body;
    const { destination } = req.params;
    const trips = {
      text: 'SELECT * FROM trips WHERE destination = $1',
      values: [destination],
    };

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    try {
      const { rows } = await pool.query(trips);

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

  static async getTripsByOrigin(req, res) {
    const { token } = req.body;
    const { origin } = req.params;
    const trips = {
      text: 'SELECT * FROM trips WHERE origin = $1',
      values: [origin],
    };

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    try {
      const { rows } = await pool.query(trips);

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
