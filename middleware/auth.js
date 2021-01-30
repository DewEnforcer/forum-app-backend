const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    if (!req.header("x-auth-token")) return res.status(401).send("No token provided");

    try {
        const user = jwt.verify(req.header("x-auth-token"), config.get("jwtPrivateKey"));
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).send("Invalid token");
    }
}