const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

let db, client;

async function connectToMongo() {
  try {
    console.log(uri);
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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

// const userSchema = new mongoose.Schema({
//   name: String
// });

// const USER = mongoose.model('USER', userSchema);

// GET all items
app.get('/users', async (req, res) => {
  try {
    // Access the 'USERS' collection
    const usersCollection = db.collection('USERS');
    
    // Retrieve all users
    const users = await usersCollection.find().toArray(); // Convert cursor to an array
    
    // Send the retrieved users in the response
    res.status(200).json(users);
  } catch (error) {
    // Handle errors
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'An error occurred while fetching users' });
  }
});



// POST new item
app.post('/USERS', async (req, res) => {
  const newUser = new Item(req.body);
  await newUser.save();
  res.status(201).json(newUser);
});

// PUT update item by ID
app.put('/USER/:id', async (req, res) => {
  try {
      const updatedItem = await USER.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
      );
      if (!updatedItem) return res.status(404).json({ message: 'USER not found' });
      res.json(updatedItem);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// DELETE item by ID
app.delete('/USER/:id', async (req, res) => {
  try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ message: 'USER not found' });
      res.json({ message: 'USER deleted' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});


app.listen(PORT, async () => {
  await connectToMongo();
  console.log(`Server is running on http://localhost:${PORT}`);
});
