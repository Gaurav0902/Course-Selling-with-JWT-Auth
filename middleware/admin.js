const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const fullToken = req.headers.authorization;
    const jwtToken = fullToken.split(' ')[1];
    try{
        const decoded = jwt.verify(jwtToken, JWT_SECRET);
        next();
    }
    catch(err){
        res.status(403).json({
            message : "You are not authorized"
        })
    }
}

module.exports = adminMiddleware;