import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../server';

const should = chai.should();

chai.use(chaihttp);

// test for sign up
describe('sign up user', () => {
  it('it should not SIGN UP a user without all required fields', (done) => {
    const profile = {
      email: 'johndoe@gmail.com',
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
