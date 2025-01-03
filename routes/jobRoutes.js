const express = require('express');
const router = express.Router();
const Job = require('../models/jobSchema');

router.post('/post', async (req, res) => {
    console.log('Received POST request to /job/post');
    console.log('Request Body:', req.body);

    try {
        const job = new Job(req.body);
        const savedJob = await job.save();
        console.log('Job saved:', savedJob);
        res.status(201).json(savedJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(400).json({ error: 'Error creating job', details: error.message });
    }
});
router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
      const jobs = query
        ? await Job.find({
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { company: { $regex: query, $options: 'i' } },
            ],
          })
        : await Job.find();
  
      res.status(200).json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching jobs' });
    }
  });
  



  

module.exports = router;
