import express from 'express';
import api from '../db/dbController';

const router = express.Router();

router.get('/', (req, res) => res.status(200).send({
  apiDocs: 'https://wayfarer4.docs.apiary.io/',
}));
router.post('/auth/signup', api.createUser);
router.post('/auth/signin', api.confirmUser);
router.post('/trips', api.createTrip);
router.get('/trips', api.getTrips);
router.post('/bookings', api.bookASeat);
router.get('/bookings', api.viewBookings);
router.delete('/bookings/:booking-id', api.deleteBooking);
router.patch('/trips/:trip-id', api.cancelTrip);

// Optional features
router.get('/api/v1/trips/destination/:destination', api.getTripsByDest);
router.get('/api/v1/trips/origin/:origin', api.getTripsByOrigin);
router.patch('/api/v1/bookings/user/:bookingId', api.changeSeat);


export default router;
