import express from 'express';
import api from '../db/dbController';

const router = express.Router();

router.get('/', (req, res) => res.status(200).send({
  apiDocs: 'https://wayfarer4.docs.apiary.io/',
}));
router.post('/api/v1/auth/signup', api.createUser);
router.post('/api/v1/auth/signin', api.confirmUser);
router.post('/api/v1/trips', api.createTrip);
router.get('/api/v1/trips', api.getTrips);
router.post('/api/v1/bookings', api.bookASeat);
router.get('/api/v1/bookings', api.viewBookings);
router.delete('/api/v1/bookings/:bookingId', api.deleteBookings);
router.patch('/api/v1/trips/:tripId', api.cancelTrip);

export default router;
