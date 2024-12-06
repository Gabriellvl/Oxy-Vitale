const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const availability = require('./availability.json');

const availabilityFilePath = path.join(__dirname, 'availability.json');

router.get('/week', (req, res) => {
    const week = availability.weeklyAvailability
    res.json(week);
});

router.get('/dates', (req, res) => {
    const dates = availability.checkedOutDates
    res.json(dates);
});

// PUT request to update weekly availability
router.put('/week', (req, res) => {
    const newWeeklyAvailability = req.body;

    // Update weekly availability in the availability object
    availability.weeklyAvailability = newWeeklyAvailability;

    // Write the updated data back to the JSON file
    fs.writeFile(availabilityFilePath, JSON.stringify(availability, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update weekly availability' });
        }
        res.json({ message: 'Weekly availability updated successfully!' });
    });
});

router.put('/dates', (req, res) => {
    const newCheckedOutDates = req.body;

    // Update checked-out dates in the availability object
    availability.checkedOutDates = newCheckedOutDates;

    // Write the updated data back to the JSON file
    fs.writeFile(availabilityFilePath, JSON.stringify(availability, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update checked-out dates' });
        }
        res.json({ message: 'Checked-out dates updated successfully!' });
    });
});


module.exports = router;
