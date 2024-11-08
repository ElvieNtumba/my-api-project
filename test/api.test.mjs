import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
// import chai from 'chai';

const chai = use(chaiHttp);

const serverUrl = 'http://3.90.151.167:8000'; // Replace with your server URL

describe('API Endpoints Tests', () => {
  // Test GET /users
  describe('GET /users', () => {
    it('should retrieve the list of users', (done) => {
      chai.request.execute(serverUrl)
      .get('/users')
      .end((err, res) => {
        if (err) {
          return done(err); // Pass the error to `done()`
        }
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done(); 
    });
  });
});

  // Test GET /users/:email (get a single user by ID)
  describe('GET /users/:email', () => {
    it('should retrieve a single user by email', (done) => {
      chai.request.execute(serverUrl)
        .get('/users/giakatuf@gmail.com')  // Use an email that exists in your database
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res).to.have.status(200);
            expect(res.body.email).to.equal('giakatuf@gmail.com');
            done();
          }
        });
    });    
  });

  describe('POST /USERS', () => {
    it('should create a new user', (done) => {
      const newUser = {
        username: 'ntumbaelvie@gmail.com',
        email: 'ntumbaelvie@gmail.com',
        password: 'password234',
      };
    
      chai.request.execute(serverUrl)
      .post('/USERS')
      .send({
        username: 'ntumbaelvie@gmail.com',
        email: 'ntumbaelvie@gmail.com',
        password: 'password234'
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res).to.have.status(201); // Should return 201
          expect(res.body).to.have.property('_id'); // Should include _id
          done();
        }
      });
    });
  });
  

  // Test GET /cart
  describe('GET /cart', () => {
    it('should retrieve the cart items', (done) => {
      chai.request.execute(serverUrl)
        .get('/cart')
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          }
        });
    });
  });

  // // Test POST /cart
  describe('POST /cart', () => {
    it('should add a new item to the cart', (done) => {
      const newCartItem = {
        _id: '6652e60b7cd388b684ef01bb', // Cart item ID
        userId: '1000',                  // User ID
        clothingType: 'baggy jeans',     // Clothing type
        price: 'R350.00',                // Price
        size: 'xs',                      // Size
        color: 'blue',                   // Color
        quantity: 1                      // Quantity
      };
    
      chai.request.execute(serverUrl)
        .post('/cart')  // Assuming POST /cart is the endpoint
        .send(newCartItem)  // Send the cart item
        .end((err, res) => {
          if (err) return done(err);
    
          // Check if the response has a status code of 201 (created)
          expect(res).to.have.status(201);  // Change expected status to 201
    
          // Check that the response contains a message indicating success
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Item added to cart');
    
          done();
        });
    });
    
    
  });

  // Test GET /clothing
  describe('GET /clothing', () => {
    it('should retrieve the list of clothing items', (done) => {
      chai.request.execute(serverUrl)
        .get('/clothing')
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
          }
        });
    });
  });

  // Test GET /clothing/:id (get a single clothing item by ID)
  describe('GET /clothing/:id', () => {
    it('should retrieve a single clothing item by ID', (done) => {
      chai.request.execute(serverUrl)
        .get('/clothing/672e649fd09cf13f18e4c19b') // Use the correct ID
        .end((err, res) => {
          if (err) {
            console.error("Error Response:", res.body);
            return done(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('_id', '672e649fd09cf13f18e4c19b');
          expect(res.body).to.have.property('name', 'T-shirt');
          expect(res.body).to.have.property('size', 'M');
          expect(res.body).to.have.property('price', 19.99);
          done();
        });
    });
    
    
  });

  // Test POST /clothing
  describe('POST /clothing', () => {
    it('should add a new clothing item', (done) => {
      chai.request.execute(serverUrl)
        .post('/clothing')
        .send({
          name: 'T-shirt',
          size: 'M',
          price: 19.99
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Clothing item added');
          expect(res.body).to.have.property('clothingItemId');
          done();
        });
    });
    
    
  });

});