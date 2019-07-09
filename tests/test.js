import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

const should = chai.should();

chai.use(chaihttp);

// test for sign up
describe('sign up user', () => {
  it('it should not SIGN UP a user without all required fields', (done) => {
    const profile = {
      email: 'johndote@gmail.com',
      firstName: 'John',
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
      email: 'johndoe@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '1234567',
      token: 'i2jeuj38393930',
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
  it('it should not SIGN IN a user without password', (done) => {
    const profile = {
      email: 'abc@yahoo.com',
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

  it('it should not SIGN IN a user with the wrong password', (done) => {
    const profile = {
      email: 'abc@yahoo.com',
      password: '11111',
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
      email: 'abc@yahoo.com',
      password: '123456',
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
      status: 'active',
      isAdmin: false,
      token: '3u3jh38333303',
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
      isAdmin: true,
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
      status: 'active',
      isAdmin: true,
      token: '373y3uh383833j3i3i',
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
        res.body.data.should.have.property('status');
        done();
      });
  });
});
// Get trips
describe('Users can get all trips', () => {
  it('it should retrieve all trips', (done) => {
    const profile = {
      token: '6yhh3n3j3k3',
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
