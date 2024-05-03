const express = require('express');
const router = express.Router();
const authTokenHandler = require('../Middlewares/checkAuthToken');
const errorHandler = require('../Middlewares/errorMiddleware');
const User = require('../Models/UserSchema');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/addwaterentry', authTokenHandler, async (req, res) => {
    const { date, amountInMilliliters } = req.body;

    if (!date || !amountInMilliliters) {
        return res.status(400).json(createResponse(false, 'Please provide date and water amount'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });
   

    user.water.push({
        date: new Date(date),
        amountInMilliliters,
    });

    await user.save();


    res.json(createResponse(true, 'Water entry added successfully'));
});

router.post('/getwaterbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId;

    const user = await User.findById({ _id: userId });

    if (!date) {
        let date = new Date();
        user.water = filterEntriesByDate(user.water, date);

        return res.json(createResponse(true, 'Water entries for today', user.water));
    }

    user.water = filterEntriesByDate(user.water, new Date(date));
    res.json(createResponse(true, 'Water entries for the date', user.water));
});



router.post('/getwaterbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All water entries', user.water));
    } else {
        let date = new Date();
        
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();
        user.water = user.water.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, `Water entries for the last ${limit} days`, user.water));
    }
});

router.delete('/deletewaterentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.water = user.water.filter(entry => {
        return entry.date.toString() !== new Date(date).toString();
    });

    await user.save();
    res.json(createResponse(true, 'Water entry deleted successfully'));
});

router.get('/getusergoalwater', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    const goalWater = 4000; // Set your goal water intake here in milliliters

    res.json(createResponse(true, 'User max water information', {goalWater }));
});

// Add this endpoint to set the drink water reminder time
router.post('/setdrinkwaterreminder', authTokenHandler, async (req, res) => {
    const { reminderTime } = req.body;

    if (!reminderTime) {
        return res.status(400).json(createResponse(false, 'Please provide a reminder time'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.drinkWaterReminder = reminderTime;
    await user.save();

    res.json(createResponse(true, 'Drink water reminder time set successfully'));
});

// Add this endpoint to get the drink water reminder time
router.get('/getdrinkwaterreminder', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    res.json(createResponse(true, 'Drink water reminder time', { reminderTime : user.drinkWaterReminder }));
});


router.use(errorHandler);

function filterEntriesByDate(entries, targetDate) {
    const entriesArray = Array.isArray(entries) ? entries : [entries];

    return entriesArray.filter(entry => {
        // Check if entry exists and has a 'date' property
        if (entry && entry.date) {
            const entryDate = new Date(entry.date);
            return (
                entryDate.getDate() === targetDate.getDate() &&
                entryDate.getMonth() === targetDate.getMonth() &&
                entryDate.getFullYear() === targetDate.getFullYear()
            );
        }
        return false; // Exclude entries without a 'date' property
    });
}
module.exports = router;