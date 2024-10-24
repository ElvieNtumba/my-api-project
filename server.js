const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// const { MongoClient } = require('mongodb')async (params) => {
//   ;
// }

let client;
let db;

const uri = 'mongodb+srv://ntumbaelvie:3LVI3_nTuMBa2006%40@cluster0.mze1d5m.mongodb.net/?retryWrites=true&w=majority';

async function connectToMongo() {
  try {
    console.log("Connecting to MongoDB...");
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: true,
    });
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

const mongoose = require('mongoose'); // Ensure mongoose is required

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const user = mongoose.model('USER', userSchema);

// GET all items
app.get('/users', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ message: 'Database not initialized' });
    }
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


app.get('/users/:email', async (req, res) => {
  try {
      const email = req.params.email; 
      const usersCollection = db.collection('USERS'); // Collection name
      const user = await usersCollection.findOne({ email: email });
      
      if (user) {
          res.json(user);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      res.status(500).send('Error retrieving user');
  }
});

// POST new item
app.post('/USERS', async (req, res) => {
  const newUser = new user(req.body);
  await newUser.save();
  res.status(201).json(newUser);
});

app.put('/user', async (req, res) => {
  const userId = req.query.userId;

  // Check if userId is a valid ObjectId
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const usersCollection = db.collection('USERS');
    const updatedUser = await usersCollection.updateOne(
      { _id: new ObjectId(userId) }, // Convert string ID to ObjectId
      { $set: req.body }
    );

    if (updatedUser.matchedCount === 0) {
      return res.status(404).json({ message: 'USER not found' });
    } else{

      res.json({ message: 'USER updated successfully' });
    }

  } catch (error) {
    console.error("Error in updating user:", error); // Log the error
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.delete('/deleteuser/:email', async (req, res) => {
  try {
      const email = req.params.email; // Get the email from the request parameters
      const usersCollection = db.collection('USERS'); // Collection name

      // Delete the user based on the email
      const result = await usersCollection.deleteOne({ email: email });

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


app.listen(PORT, '0.0.0.0', async () => {
  await connectToMongo();
  console.log(`Server is running on http://3.81.249.217:${PORT}`);
});
