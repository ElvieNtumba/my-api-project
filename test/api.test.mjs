import { expect, use } from 'chai';
import chaiHttp from 'chai-http';

const chai = use(chaiHttp);

const serverUrl = 'http://54.237.234.198:8000'; // Replace with your server URL

describe('API Endpoints Tests', () => {
  // Test GET /users
  describe('GET /users', () => {
    it('should retrieve the list of users', (done) => {
      chai.request.execute(serverUrl)
        .get('/users')
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

  // Test POST /cart
  describe('POST /cart', () => {
    it('should add a new item to the cart', (done) => {
      const cartItem = { productId:"1001", quantity: 2 }; // Sample cart item data
      chai.request.execute(serverUrl)
        .post('/cart')
        .send(cartItem)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            console.log(res.body)
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('cartItemId').equal('672df4abde67d217415ebf6b');
            // expect(res.body).to.have.property('quantity').equal(2);
            done();
          }
        });
    });
  });

  // Test GET /clothing
  // describe('GET /clothing', () => {
  //   it('should retrieve the list of clothing items', (done) => {
  //     chai.request.execute(serverUrl)
  //       .get('/clothing')
  //       .end((err, res) => {
  //         if (err) {
  //           done(err);
  //         } else {
  //           expect(res).to.have.status(200);
  //           expect(res.body).to.be.an('array');
  //           done();
  //         }
  //       });
  //   });
  // });

  // Test GET /clothing/:id (get a single clothing item by ID)
  // describe('GET /clothing/:id', () => {
  //   it('should retrieve a single clothing item by ID', (done) => {
  //     const clothingId = '67890'; // Sample clothing ID, replace with a valid ID if needed
  //     chai.request.execute(serverUrl)
  //       .get(`/clothing/${clothingId}`)
  //       .end((err, res) => {
  //         if (err) {
  //           done(err);
  //         } else {
  //           expect(res).to.have.status(200);
  //           expect(res.body).to.be.an('object');
  //           expect(res.body).to.have.property('_id').equal(clothingId);
  //           done();
  //         }
  //       });
  //   });
  // });

  // Test POST /clothing
  // describe('POST /clothing', () => {
  //   it('should add a new clothing item', (done) => {
  //     const clothingItem = { name: 'T-shirt', size: 'M', price: 19.99 }; // Sample clothing item data
  //     chai.request.execute(serverUrl)
  //       .post('/clothing')
  //       .send(clothingItem)
  //       .end((err, res) => {
  //         if (err) {
  //           done(err);
  //         } else {
  //           expect(res).to.have.status(201);
  //           expect(res.body).to.be.an('object');
  //           expect(res.body).to.have.property('name').equal('T-shirt');
  //           expect(res.body).to.have.property('size').equal('M');
  //           expect(res.body).to.have.property('price').equal(19.99);
  //           done();
  //         }
  //       });
  //   });
  // });

});