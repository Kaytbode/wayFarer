import jwt from 'jsonwebtoken';
import 'dotenv/config';
import moment from 'moment';
import pool from './index';

class api {
  static generateToken(firstName, email, lastName, password, isAdmin) {
    const token = jwt.sign({
      firstName, email, lastName, password, isAdmin,
    },
    process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRY_SECONDS,
    });

    return token;
  }

  static async createUser(req, res) {
    const { email, password } = req.body;

    const firstName = req.body.first_name;
    const lastName = req.body.last_name;

    const isAdmin = false;

    const token = api.generateToken(firstName, email, lastName, password, isAdmin);

    const profile = {
      text: `INSERT INTO users (email, first_name, last_name, password, token, is_admin)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [email, firstName, lastName, password, token, isAdmin],
    };

    try {
      const { rows } = await pool.query(profile);

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
    const { email, password } = req.body;

    const profile = {
      text: 'SELECT * FROM users WHERE email = $1 AND password = $2',
      values: [email, password],
    };

    try {
      const { rows } = await pool.query(profile);

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
      token, origin, destination, fare,
    } = req.body;

    const busId = req.body.bus_id;

    const tripDate = req.body.trip_date;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    const payload = jwt.decode(token);

    const { isAdmin } = payload;

    if (!JSON.parse(isAdmin)) {
      return res.status(403).send({
        status: 'error',
        error: 'You do not have the permission to create trip',
      });
    }

    const trip = {
      text: `INSERT INTO trips (bus_id, origin, destination, trip_date, fare) 
      VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [busId, origin, destination, tripDate, fare],
    };

    try {
      const { rows } = await pool.query(trip);

      return res.status(201).send({
        status: 'success',
        data: {
          id: rows[0].id,
          bus_id: busId,
          origin,
          destination,
          trip_date: tripDate,
          fare,
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
    const { token } = req.body;

    const tripId = req.body.trip_id;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    if (!tripId) {
      return res.status(400).send({
        status: 'error',
        error: 'Please provide a trip id',
      });
    }

    const payload = jwt.decode(token);

    const { email, firstName, lastName } = payload;

    const createdOn = moment().format('YYYY-MM-DD');

    const trip = {
      text: 'SELECT * FROM trips WHERE id = $1',
      values: [tripId],
    };

    const user = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };

    const getSeatsBooked = {
      text: 'SELECT * FROM booking WHERE trip_id = $1',
      values: [tripId],
    };

    try {
      // get bus id and trip date from trip table
      let { rows } = await pool.query(trip);

      const busId = rows[0].bus_id;

      const tripDate = rows[0].trip_date;

      const getBus = {
        text: 'SELECT * FROM buses WHERE id = $1',
        values: [busId],
      };

      ({ rows } = await pool.query(getBus));

      const { capacity } = rows[0];
      // get user id from users table
      ({ rows } = await pool.query(user));

      const userId = rows[0].id;
      // get the seats booked on a trip from booking table
      ({ rows } = await pool.query(getSeatsBooked));

      const seatsBooked = rows.map(booking => booking.seat_number);
      // Assume bus contains 500 seats
      const allSeats = Array.from({ length: capacity }, (v, i) => i + 1);
      // Find an empty seat
      const seatNumber = allSeats.find(seat => seatsBooked.indexOf(seat) < 0);
      // Now book the trip
      const newBooking = {
        text: `INSERT INTO booking (user_id, trip_id, created_on, bus_id, trip_date, seat_number, 
          first_name, last_name, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        values: [tripId, userId, createdOn, busId, tripDate,
          seatNumber, firstName, lastName, email],
      };

      ({ rows } = await pool.query(newBooking));

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
    const { token } = req.body;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    const payload = jwt.decode(token);

    const { isAdmin, email } = payload;

    const findUserId = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };

    try {
      let { rows } = await pool.query(findUserId);

      const userId = rows[0].id;

      const userBookings = {
        text: 'SELECT * FROM booking WHERE user_id = $1',
        values: [userId],
      };

      const bookings = JSON.parse(isAdmin) ? 'SELECT * FROM booking' : userBookings;

      ({ rows } = await pool.query(bookings));

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

  static async deleteBooking(req, res) {
    const { token } = req.body;

    const bookingId = req.params.booking_id;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    const payload = jwt.decode(token);

    const { email } = payload;

    const findUserId = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    };

    try {
      let { rows } = await pool.query(findUserId);

      const userId = rows[0].id;

      const myBookings = {
        text: 'DELETE FROM booking WHERE user_id = $1 AND id = $2 RETURNING *',
        values: [userId, bookingId],
      };

      ({ rows } = await pool.query(myBookings));

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
    const { token } = req.body;

    const tripId = req.params.trip_id;

    const trip = {
      text: 'UPDATE trips SET status = $1 WHERE id = $2 RETURNING *',
      values: ['cancelled', tripId],
    };

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    const payload = jwt.decode(token);

    const { isAdmin } = payload;

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

  static async changeSeat(req, res) {
    const { token } = req.body;

    const { bookingId } = req.params;

    if (!token) {
      return res.status(401).send({
        status: 'error',
        error: 'User unauthorized',
      });
    }

    const getTripId = {
      text: 'SELECT * FROM booking WHERE id = $1',
      values: [bookingId],
    };

    try {
      let { rows } = await pool.query(getTripId);

      const tripId = rows[0].trip_id;

      const { email } = rows[0];

      const busId = rows[0].bus_id;

      const getUserId = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      };

      ({ rows } = await pool.query(getUserId));

      const userId = rows[0].id;

      const getBus = {
        text: 'SELECT * FROM buses WHERE id = $1',
        values: [busId],
      };

      ({ rows } = await pool.query(getBus));

      const { capacity } = rows[0];

      const getSeatsBooked = {
        text: 'SELECT * FROM booking WHERE trip_id = $1',
        values: [tripId],
      };

      ({ rows } = await pool.query(getSeatsBooked));

      const seatsBooked = rows.map(booking => booking.seat_number);
      // Assume bus contains 500 seats
      const allSeats = Array.from({ length: capacity }, (v, i) => i + 1);
      // Find an empty seat
      const seatNumber = allSeats.find(seat => seatsBooked.indexOf(seat) < 0);
      // change seat
      const newSeat = {
        text: 'UPDATE booking SET seat_number = $1 WHERE id = $2  AND user_id = $3 RETURNING *',
        values: [+seatNumber, +bookingId, +userId],
      };

      ({ rows } = await pool.query(newSeat));

      return res.status(200).send({
        status: 'success',
        data: {
          message: 'Seat changed successfully',
          seat_number: rows[0].seat_number,
          user_id: rows[0].user_id,
          booking_id: rows[0].id,
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
