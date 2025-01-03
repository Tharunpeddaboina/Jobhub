const express = require('express');
const router = express.Router();
const Recruiter = require('../models/RecuriterSchema');
const { jwtAuthMiddleware } = require('../jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const recruiter = new Recruiter(req.body);
        const savedRecruiter = await recruiter.save();
        res.status(201).json(savedRecruiter);
    } catch (error) {
        res.status(400).json({ error: 'Error creating recruiter' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const recruiter = await Recruiter.findOne({ username });
        if (!recruiter) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, recruiter.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: recruiter._id, userType: 'recruiter' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ id: recruiter._id, username: recruiter.username, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

router.get('/', async (req, res) => {
    try {
        const recruiters = await Recruiter.find();
        res.status(200).json(recruiters);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching recruiters' });
    }
});

router.get('/:recruiterId', async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.params.recruiterId);
        if (!recruiter) return res.status(404).json({ error: 'Recruiter not found' });
        res.status(200).json(recruiter);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recruiter' });
    }
});

router.put('/:recruiterId', jwtAuthMiddleware, async (req, res) => {
    try {
        const updatedRecruiter = await Recruiter.findByIdAndUpdate(req.params.recruiterId, req.body, { new: true });
        if (!updatedRecruiter) return res.status(404).json({ error: 'Recruiter not found' });
        res.status(200).json(updatedRecruiter);
    } catch (error) {
        res.status(400).json({ error: 'Error updating recruiter' });
    }
});

router.delete('/:recruiterId', jwtAuthMiddleware, async (req, res) => {
    try {
        const deletedRecruiter = await Recruiter.findByIdAndDelete(req.params.recruiterId);
        if (!deletedRecruiter) return res.status(404).json({ error: 'Recruiter not found' });
        res.status(200).json({ message: 'Recruiter deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting recruiter' });
    }
});

module.exports = router;
