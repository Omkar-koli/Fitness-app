const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'inft.20101b0069@gmail.com',
        pass: 'fvrywqdqchbczekp',
    }
})

router.get('/test', async (req, res) => {
    res.json({
        message: "Auth API is Working"
    })
})

function createResponse(ok, message, data) {
    return{
        ok,
        message,
        data,
    };
}

router.post('/register', async (req, res, next) => {
    try{
        const { name, email, password, weightInKg, heightInCm, gender, dob, goal, activityLevel } = req.body;
        const existingUser = await User.findOne({ email: email});

        if (existingUser) {
            return res.status(409).json(createResponse(false, 'Email already exists'));
        }
        const newUser = new User({
            name,
            password,
            email,
            weight: [
                {
                    weight: weightInKg,
                    unit : "kg",
                    date: Date.now()
                }
            ],
            height: [
                {
                    height: heightInCm,
                    date: Date.now(),
                    unit: "cm"
                }
            ],
            gender,
            dob,
            goal,
            activityLevel
        });
        await newUser.save(); 
        res.status(201).json(createResponse(true, 'User registered successfully'));
    }
    catch (err) {
        next(err);
    }
})
router.post('/login', async (req, res, next) => {
    try{
        const { email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(createResponse(false, 'Inavlid credentials'));
        }
        const authToken = jwt.sign({ userId: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '50m'});
        const refreshToken = jwt.sign({ userId: user._id}, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '100m'});

        res.cookie('authToken', authToken, { http: true});
        res.cookie('refreshToken', refreshToken, { httpOnly: true});
        res.status(200).json(createResponse(true, 'Login successful', {
            authToken,
            refreshToken,
        }));
    }
    catch (err) {
        next(err);
    }
})
router.post('/sendotp', async (req, res) => {
    try{
        const { email } = req.body; 
        const otp = math.floor(100000 + Math.random() * 900000);

        const mailOptions ={
            from : 'inft.20101b0069@gmail.com',
            to: email,
            subject: 'OTP for verification',
            text: `Your OTP is ${otp}`
        }

        transporter.sendMail(mailOptions, async (err, info) => {
            if(err) {
                console.log(err);
                res.status(500).json(createResponse(false, err.message));
            } else {
                res.json(createResponse(true, 'OTP sent successfully', { otp }));
            }
        });
    }
    catch (err){
        next(err);
    }
})
router.post('/logout', (req, res) => {
    // Clear the authentication tokens stored in cookies or headers
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');

    // Respond with a success message
    res.status(200).json(createResponse(true, 'Logout successful'));
});
router.post('/checklogin', authTokenHandler,async (req, res, next) => {
   res.json({
    ok: true,
    message: 'User autheticated successfully'
   })
})
router.use(errorHandler)

module.exports = router;
