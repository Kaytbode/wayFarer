import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../server';


const should = chai.should();

chai.use(chaihttp);

// test for sign up
describe('sign up user', () => {
  it('it should not SIGN UP a user without all required fields', (done) => {
    const profile = {
      email: 'ac@gmail.com',
      firstName: 'Joh',
      lastName: 'Doe',
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
      email: 'ac@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '1234567',
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
      email: 'ac@gmail.com',
    };

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });

  it('it should SIGN IN a user that has a password', (done) => {
    const profile = {
      email: 'ac@gmail.com',
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
      busId: 4,
      origin: 'ikeja',
      destination: 'agege',
      tripDate: '05-07-2019',
      fare: 100.45,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
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
      busId: 4,
      origin: 'ikeja',
      destination: 'agege',
      tripDate: '05-07-2019',
      fare: 100.45,
      status: 'active',
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
      busId: 4,
      origin: 'ikeja',
      destination: 'mushin',
      tripDate: '05-07-2019',
      fare: 100.45,
      isAdmin: true,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AeWFob28uY29tIiwibGFzdE5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjI5NDMyNzYsImV4cCI6MTU2Mjk0Mzg4MH0.2OortBYCqgHcgSx7fmDh',
    };
    chai.request(app)
      .post('/api/v1/trips')
      .send(trip)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.status.should.be.a('string');
        res.body.data.should.have.property('trip_id');
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
      tripId: 259,
    };
    chai.request(app)
      .post('/api/v1/bookings')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.data.should.have.property('trip_id');
        res.body.data.should.have.property('bus_id');
        res.body.data.should.have.property('booking_id');
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
      tripId: 230,
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AeWFob28uY29tIiwibGFzdE5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjI5NDMyNzYsImV4cCI6MTU2Mjk0Mzg4MH0.2OortBYCqgHcgSx7fmDh',
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
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

// delete bookings
describe('Delete bookings', () => {
  it('user can delete booking', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
    };
    chai.request(app)
      .delete('/api/v1/bookings/13')
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
      .delete('/api/v1/bookings/14')
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AeWFob28uY29tIiwibGFzdE5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjI5NDMyNzYsImV4cCI6MTU2Mjk0Mzg4MH0.2OortBYCqgHcgSx7fmDh',
    };
    chai.request(app)
      .patch('/api/v1/trips/3')
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
    };
    chai.request(app)
      .patch('/api/v1/trips/9')
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
      .patch('/api/v1/trips/9')
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
    };
    chai.request(app)
      .get('/api/v1/trips/destination/mushin')
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
      .get('/api/v1/trips/destination/mushin')
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
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
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

// Change seat
describe('Change seat', () => {
  it('User can change seat', (done) => {
    const profile = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJrYXRlIiwiZW1haWwiOiJhYmNAeWFob28uY29tIiwibGFzdE5hbWUiOiJjaGlsbCIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU2MjU5Nzc2OCwiZXhwIjoxNTYyNTk4MzcyfQ.DBlpLHrge2j_pa7M1RXvG',
    };
    chai.request(app)
      .patch('/api/v1/bookings/user/14')
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
      .patch('/api/v1/bookings/user/14')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
  });
});
