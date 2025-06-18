const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const articleRoutes = require('./articleRoute');
const userRoutes = require('./userRoute');
const cloudinaryRoutes = require('./cloudinaryRoute');
const themeRoutes = require('./themesRoutes');
const mailRoutes = require('./mailRoute');
const clientRoutes = require('./clientRoute');
const availabilityRoutes = require('./availabilityRoute');
const roomRoutes = require('./roomRoute');
const bookRoutes = require('./bookRoute');


const cors = require('cors');
const axios = require('axios');

const origin = process.env.FRONT_END_URL;
const url = process.env.BACK_END_URL;


var corsOptions = {
    origin,
    credentials: true,
    optionsSuccessStatus: 200
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

mongoose.connect(process.env.URL_MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected successfully to MongoDB Atlas'))
    .catch(err => console.error('Connection error', err));

process.on('SIGINT', function() {
    mongoose.connection.close().then(() => {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});

app.use('/articles', articleRoutes);
app.use('/users', userRoutes);
app.use('/upload', cloudinaryRoutes);
app.use('/themes', themeRoutes);
app.use('/mail', mailRoutes);
app.use('/client', clientRoutes);
app.use('/availability', availabilityRoutes);
app.use('/room', roomRoutes);
app.use('/book', bookRoutes);


function ensureAuthor(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'Author') {
        return next();
    } else {
        res.status(403).send('Forbidden');
    }
}

// Usage
app.get('/author-dashboard', ensureAuthor, (req, res) => {
    res.send('Welcome to the Author Dashboard');
});


const interval = 6 * 60 * 60 * 1000; // Interval in milliseconds (30 seconds)

// hack render.com lol, constant ping
function reloadWebsite() {
    axios.get(url)
        .then(response => {
            console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
        })
        .catch(error => {
            console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
        });
}

// they caught me
// setInterval(reloadWebsite, interval);

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
