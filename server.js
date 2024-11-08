import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

let db, client;
async function connectToMongo() {
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db("WONKANETclothingstoreDB");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// User Sign-up
app.post('/wonkanet-app/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const usersCollection = db.collection('USERS');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const result = await usersCollection.insertOne({
      username,
      email,
      password
    });

    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User Sign-in
app.post('/wonkanet-app/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usersCollection = db.collection('USERS');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'Sign in successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ message: 'Database not initialized' });
    }
    const users = await db.collection('USERS').find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by email
app.get('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const usersCollection = db.collection('USERS');
    const user = await usersCollection.findOne({ email });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving user');
  }
});
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const usersCollection = mongoose.connection.collection('users');
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create a new user without password hashing (if you still want plain-text password)
    const newUser = new User({
      username,
      email,
      password // Storing the plain-text password
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    console.log('User created successfully:', savedUser);
    return res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
  } catch (error) {
    // Log the error for debugging
    console.error('Error during user registration:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
});

// Update a user
app.put('/user', async (req, res) => {
  const userId = req.query.userId;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const usersCollection = db.collection('USERS');
    const updatedUser = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: req.body }
    );

    if (updatedUser.matchedCount === 0) {
      return res.status(404).json({ message: 'USER not found' });
    }

    res.json({ message: 'USER updated successfully' });
  } catch (error) {
    console.error("Error in updating user:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/deleteuser/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const usersCollection = db.collection('USERS');

    const result = await usersCollection.deleteOne({ email });

    if (result.deletedCount === 1) {
      res.status(200).send('User successfully deleted');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).send('Error deleting user');
  }
});

// Cart Routes

// GET /cart - Get all cart items
app.get('/cart', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ message: 'Database not initialized' });
    }
    const cartItems = await db.collection('cart').find().toArray();
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Error fetching cart items' });
  }
});

// POST /cart - Add a new item to the cart
app.post('/cart', async (req, res) => {
  const { cartItemId } = req.body;

  try {
    const cartCollection = db.collection('cart');
    const newCartItem = {
      cartItemId
    };
    const result = await cartCollection.insertOne(newCartItem);
    res.status(201).json({ message: 'Item added to cart', cartItemId: result.insertedId });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

// Clothing Routes

// GET /clothing - Get all clothing items
app.get('/clothing', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ message: 'Database not initialized' });
    }
    const clothingItems = await db.collection('clothing').find().toArray();
    res.json(clothingItems);
  } catch (error) {
    console.error('Error fetching clothing items:', error);
    res.status(500).json({ message: 'Error fetching clothing items' });
  }
});

// GET /clothing/:id - Get a specific clothing item by ID
app.get('/clothing/:id', async (req, res) => {
  const clothingId = req.params.id;

  try {
    const clothingItem = await db.collection('clothing').findOne({ _id: new ObjectId(clothingId) });

    if (clothingItem) {
      res.json(clothingItem);
    } else {
      res.status(404).send('Clothing item not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving clothing item');
  }
});

// POST /clothing - Add a new clothing item
app.post('/clothing', async (req, res) => {
  const { name, size, price } = req.body;

  try {
    const clothingCollection = db.collection('clothing');
    const newClothingItem = {
      name,
      size,
      price
    };
    const result = await clothingCollection.insertOne(newClothingItem);
    res.status(201).json({ message: 'Clothing item added', clothingItemId: result.insertedId });
  } catch (error) {
    console.error('Error adding clothing item:', error);
    res.status(500).json({ message: 'Error adding clothing item' });
  }
});


// Start server
app.listen(PORT, '0.0.0.0', async () => {
  await connectToMongo();
  console.log(`Server is running on http://localhost:${PORT}`);
});