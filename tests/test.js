import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../server';


const should = chai.should();

chai.use(chaihttp);

// test for sign up
describe('sign up user', () => {
  it('it should not SIGN UP a user without all required fields', (done) => {
    const profile = {
      email: 'fring@gmail.com',
      first_name: 'Joh',
      last_name: 'Doe',
    };

    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('it should SIGN UP a user that meets all criteria', (done) => {
    const profile = {
      email: 'trliyoms@gmail.com',
      first_name: 'John',
      last_name: 'Doe',
      password: '789',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.a('string');
        res.body.data.should.have.property('user_id');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('is_admin');
        done();
      });
  });
});
// test for sign in
describe('user can sign in', () => {
  it('it should not SIGN IN a user without a password', (done) => {
    const profile = {
      email: 'acod@gmail.com',
    };

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should SIGN IN a user that has a password', (done) => {
    const profile = {
      email: 'acod@gmail.com',
      password: '1234567',
    };

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(profile)
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.have.property('user_id');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('is_admin');
        done();
      });
  });
});
// Admins can create trips
describe('Admin can create trip', () => {
  it('it should not allow non-admins to create trip', (done) => {
    const trip = {
      origin: 'ikeja',
      destination: 'agege',
      bus_id: 1,
      trip_date: '2019-05-08',
      fare: 100.45,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
    };

    chai.request(app)
      .post('/api/v1/trips')
      .send(trip)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        done();
      });
  });
  it('it should not allow trip to be created without a token', (done) => {
    const trip = {
      origin: 'ikeja',
      destination: 'agege',
      fare: 100.45,
    };

    chai.request(app)
      .post('/api/v1/trips')
      .send(trip)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
  it('it should allow admins to create trip', (done) => {
    const trip = {
      origin: 'ikeja',
      destination: 'agege',
      trip_date: '2019-05-08',
      bus_id: 1,
      fare: 100.45,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AeWFob28uY29tIiwibGFzdE5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjI5NDMyNzYsImV4cCI6MTU2Mjk0Mzg4MH0.2OortBYCq',
    };
    chai.request(app)
      .post('/api/v1/trips')
      .send(trip)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.a('string');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('bus_id');
        res.body.data.should.have.property('origin');
        res.body.data.should.have.property('destination');
        res.body.data.should.have.property('trip_date');
        res.body.data.should.have.property('fare');
        done();
      });
  });
});
// Get trips
describe('Users can get all trips', () => {
  it('it should retrieve all trips', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
    };
    chai.request(app)
      .get('/api/v1/trips')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.a('string');
        res.body.data.should.be.a('array');
        done();
      });
  });
  it('it should not get trips without a token', (done) => {
    const profile = {

    };
    chai.request(app)
      .get('/api/v1/trips')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});

// Book a trip
describe('Users can book trips', () => {
  it('it should book a trip if all parameters are available', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
      trip_id: 6,
    };
    chai.request(app)
      .post('/api/v1/bookings')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('bus_id');
        res.body.data.should.have.property('trip_id');
        res.body.data.should.have.property('user_id');
        res.body.data.should.have.property('trip_date');
        res.body.data.should.have.property('seat_number');
        res.body.data.should.have.property('first_name');
        res.body.data.should.have.property('last_name');
        res.body.data.should.have.property('email');
        done();
      });
  });
  it('it should not book a trip without a token', (done) => {
    const profile = {
      tripId: 2,
    };
    chai.request(app)
      .post('/api/v1/bookings')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});

// view bookings
describe('View bookings', () => {
  it('Admin can view all bookings', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AeWFob28uY29tIiwibGFzdE5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjI5NDMyNzYsImV4cCI6MTU2Mjk0Mzg4MH0.2OortBYCq',
    };
    chai.request(app)
      .get('/api/v1/bookings')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('array');
        done();
      });
  });
  it('User can view his/her bookings', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
    };
    chai.request(app)
      .get('/api/v1/bookings')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('array');
        done();
      });
  });
  it('it should not get bookings without a token', (done) => {
    const profile = {

    };
    chai.request(app)
      .get('/api/v1/bookings')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});

// Change seat
describe('Change seat', () => {
  it('User can change seat', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
    };
    chai.request(app)
      .patch('/api/v1/bookings/user/5')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('object');
        done();
      });
  });

  it('User cannot change seat without a token', (done) => {
    const profile = {

    };
    chai.request(app)
      .patch('/api/v1/bookings/user/1')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});

// delete bookings
describe('Delete bookings', () => {
  it('user can delete booking', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
    };
    chai.request(app)
      .delete('/api/v1/bookings/36')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('object');
        done();
      });
  });
  it('it should not delete booking without a token', (done) => {
    const profile = {

    };
    chai.request(app)
      .delete('/api/v1/bookings/1')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});

// cancel trip
describe('Cancel trips', () => {
  it('Admin can cancel trips', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AeWFob28uY29tIiwibGFzdE5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjI5NDMyNzYsImV4cCI6MTU2Mjk0Mzg4MH0.2OortBYCq',
    };
    chai.request(app)
      .patch('/api/v1/trips/5')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('object');
        done();
      });
  });
  it('Non admins cannot cancel trips', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
    };
    chai.request(app)
      .patch('/api/v1/trips/5')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        done();
      });
  });
  it('it should not cancel trips without a token', (done) => {
    const profile = {

    };
    chai.request(app)
      .patch('/api/v1/trips/5')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});

// filter by destination
describe('Trips by Destination', () => {
  it('Users can view trips by destination', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
    };
    chai.request(app)
      .get('/api/v1/trips/destination/agege')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('array');
        done();
      });
  });

  it('users should not view trips without a token', (done) => {
    const profile = {

    };
    chai.request(app)
      .get('/api/v1/trips/destination/agege')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});

// filter by origin
describe('Trips by Origin', () => {
  it('Users can view trips by origin', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2RAZ21haWwuY29tIiwibGFzdE5hbWUiOiJEb2UiLCJwYXNzd29yZCI6IjEyMzQ1NjciLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTYzMjc0MTM2LCJleHAiOjE1NjMyNzQ3NDB9.YkMCqQvaD53W0lffD2ujrOLIecSYgCuG93AXrpm9U4Y',
    };
    chai.request(app)
      .get('/api/v1/trips/origin/ikeja')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.data.should.be.a('array');
        done();
      });
  });

  it('users should not view trips without a token', (done) => {
    const profile = {

    };
    chai.request(app)
      .get('/api/v1/trips/origin/ikeja')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});
