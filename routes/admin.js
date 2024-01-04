const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const {Admin, User, Course} = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.headers.username;
    const password = req.headers.password;

    await Admin.create({
        username,
        password
    });

    res.json({
        message : "Admin Created Successfully"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const isValidated = await Admin.findOne({
        username,
        password
    });

    if(!isValidated){
        res.status(403).json({
            message : "You are not authenticated",
        })
        return;
    }

    const token = jwt.sign({username}, JWT_SECRET);
    res.json({token});
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const course = await Course.create({
        title : req.body.title,
        description : req.body.description,
        imageLink : req.body.imageLink,
        price : req.body.price
    });

    res.json({
        message : "Course Created Successfully",
        courseId : course._id,
    });

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const ALL_COURSES = await Course.find({});
    res.json({
        ALL_COURSES
    })
});

module.exports = router;