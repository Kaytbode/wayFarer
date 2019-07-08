import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

const should = chai.should();

chai.use(chaihttp);

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
