const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL)
  .then(() => console.log('Connected to MongoDB server'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

db.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

db.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});
mongoose.set("debug", true);


module.exports = db;
