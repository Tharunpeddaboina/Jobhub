const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const { generateToken, jwtAuthMiddleware } = require('./../jwt');

const saltRounds = 10; 

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, name } = req.body;

        if (!email || !password || !role || !name) {
            return res.status(400).json({ error: 'Please fill all fields' });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ error: 'User already exists. Please login!' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            name,
        });

        const savedUser = await newUser.save();
        console.log('Hashed Password:', savedUser.password); 

        const token = generateToken({ id: savedUser._id, email: savedUser.email });
        res.status(201).json({ token, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user._id, email: user.email });
        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

// Update User
router.put('/:userId', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: 'Error updating user' });
    }
});

// Delete User
router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;
