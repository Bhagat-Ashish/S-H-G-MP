const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

// Register User

router.post('/register',async (req,res) => {
    try {
        // User is already registered
        const user = await User.findOne({ email: req.body.email });
        if (user){
            throw new Error('User already registered');
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        // Create a new user
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: 'User registered successfully',
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// Login User

router.post('/login', async (req,res) => {
    try {
        //User Not Registered
        const user = await User.findOne({email : req.body.email})
        if (!user){
            throw new Error('User not registered');
        }

        //user status

        if(user.status !== 'active'){
            throw new Error('User account is Blocked, contact the Admin');
        }
        
        // Check Password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch){
            throw new Error('Invalid Password');
        }
        
        // Generate JWT
        const token = jwt.sign({userId : user._id }, process.env.jwt_secret , {expiresIn : "1d",});
        res.send({
            success: true,
            message: 'User logged in successfully',
            data: token,
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

// Get Current User

router.get('/get-current-user',authMiddleware,async (req,res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            success: true,
            message: 'User fetched successfully',
            data: user,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

//Get All Users

router.get('/get-users',authMiddleware,async (req,res) => {
    try {
        const users = await User.find();
        res.send({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});

//Update User

router.put('/update-user-status/:id',authMiddleware,async (req,res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.send({
            success: true,
            message: "User updated successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;