const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const RecruiterRoutes = require('./routes/RecuriterRoutes');

require('dotenv').config();

const app = express();

// Apply CORS middleware globally for all routes
app.use(cors());

// Manually add CORS headers for all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins (change as necessary)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specific methods
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization'); // Allow specific headers
    next();
});

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.use('/job', jobRoutes);
app.use('/recruiter', RecruiterRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
