import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

const should = chai.should();

chai.use(chaihttp);
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
