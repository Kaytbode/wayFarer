import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

const should = chai.should();

chai.use(chaihttp);

// test for sign in
describe('user can sign in', () => {
  it('it should not SIGN IN a user without password', (done) => {
    const profile = {
      email: 'johndoe@gmail.com',
    };

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
  it('it should SIGN IN a user that meets all criteria', (done) => {
    const profile = {
      email: 'halo@yahoo.com',
      password: '123456',
    };
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.status.should.be.a('string');
        res.body.data.should.have.property('user_id');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('is_admin');
        done();
      });
  });
  it('it should not SIGN IN a user with a wrong password', (done) => {
    const profile = {
      email: 'halo@yahoo.com',
      password: '12311',
    };

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(profile)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        done();
      });
  });
});
