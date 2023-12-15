const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 
const mongoose = require('mongoose');
const User = require('../model/user');

chai.use(chaiHttp);
const expect = chai.expect;

// Define a test user
const testUser = {
    fullname: 'Test User',
    email: 'test@example.com',
    role: 'user',
    password: 'testpassword',
    preferences: ['technology', 'science'],
  };
  
  describe('API Tests', () => {
    before(async () => {
        if (mongoose.connection.readyState === 1) {
          // Connection is open, close it
          await mongoose.connection.close();
        }
      
        await mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 3000,
        });
      });
  
    after(async () => {
      // Disconnect and close the connection after tests
      await mongoose.connection.close();
    });
  
    beforeEach(async () => {
      // Clear the User collection before each test
      await User.deleteMany({});
    });
  
    describe('User Registration', () => {
      it('should register a new user', async () => {
        const res = await chai
          .request(app)
          .post('/register')
          .send(testUser);
  
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('user saved successfully');
        expect(res.body.data).to.have.property('_id');
      });
  
      it('should handle duplicate email during registration', async () => {
        // Register the user first
        await chai.request(app).post('/register').send(testUser);
  
        // Try to register the same user again
        const res = await chai.request(app).post('/register').send(testUser);
  
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Email already exists');
      });
  
    });

  });