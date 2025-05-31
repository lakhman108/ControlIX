const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secret_key = process.env['JWT_SECRET'];

const auth = async (req, res, next) => {
    try {
        let token;
        
        // Check for token in cookies
        const tokenFromCookies = req.cookies.token;
        // Check for token in authorization header
        const authorizationHeader = req.header('Authorization');
        
        // Use cookie token if available, otherwise try authorization header
        if (tokenFromCookies) {
            token = tokenFromCookies;
        } else if (authorizationHeader) {
            token = authorizationHeader.replace('Bearer ', '');
        } else {
            return res.status(401).json({ error: "No authentication token found!" });
        }

        console.log("Auth Attempt!");

        const verifytoken = jwt.verify(token, secret_key);

        var rootUser = await User.findOne({ _id: verifytoken._id, "tokens.token": token });

        if (!rootUser) {
            return res.status(404).json({ error: "User Not Found!" });
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong!" });
    }
}

module.exports = auth;