const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    await User.create({
        username : req.headers.username,
        password : req.headers.password,
        coursesPurchased : []
    })

    res.json({
        message : "User Created Successfully",
    })
});

router.post('/signin', (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = User.findOne({
        username,
        password
    })

    if(!existingUser){
        res.status(411).json({
            message : "Incorrect credentials"
        })
    } else {
        const token = jwt.sign({username}, JWT_SECRET);
        res.json({token});
    }
});

router.get('/courses', userMiddleware, async (req, res) => {
    // Implement listing all courses logic
    const ALL_COURSES = await Course.find({});
    res.json({ALL_COURSES});
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.username;
    await User.updateOne({
        username
    }, {
        "$push":{
            coursesPurchased : courseId
        }
    })
    res.json({
        message : "Purchase Completed"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username;
    console.log(username);
    const user = await User.findOne({username});
    const coursesPurchased = user.coursesPurchased;
    console.log(coursesPurchased);
    const purchasedCourses = await Course.find({
        _id : {
            "$in" : coursesPurchased
        }
    });
    res.json({
        purchasedCourses
    })
});

module.exports = router