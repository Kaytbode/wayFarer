import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

const should = chai.should();

chai.use(chaihttp);
// Users can get trips
describe('Users can get all trips', () => {
  it('it should retrieve all trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.a('string');
        res.body.data.should.be.a('array');
        done();
      });
  });
});
