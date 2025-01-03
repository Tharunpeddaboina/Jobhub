const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); 
const cors = require('cors'); 
const userRoutes = require('./routes/userRoutes');
const jobRoutes=require('./routes/jobRoutes')
const RecruiterRoutes=require('./routes/RecuriterRoutes')

require('dotenv').config();


const app = express();
app.use(bodyParser.json()); 

const PORT = process.env.PORT || 8000;
app.use(cors({ origin: '*' }));

app.use('/job', jobRoutes);
app.use('/recruiter', RecruiterRoutes);
app.use('/user', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
