const express = require('express');
const router = express.Router();
const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


/*

// Get all accounts
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
});



// Get account details via ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new account
router.post('/', async (req, res) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the saltRounds

        // Create a new user with the hashed password
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            profile_picture: req.body.profile_picture
        });

        await user.save(); // Save the user to the database
        res.status(201).json(user); // Send back the created user
    } catch (error) {
        res.status(400).json({ error: error.message }); // Send back error message if there's an error
    }
});

 */

router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // identifier can be either username or email

    try {
        // Find the user by username or email
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or email' });
        }

        // Compare the hashed password with the provided password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const jwtToken = jwt.sign(
            {username: user.username},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.json({message: "Welcome Back!", token: jwtToken })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
