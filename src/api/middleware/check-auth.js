const jwt = require('jsonwebtoken');
const settings = require('../../settings');
const helper = require('../utils/helper');
const NAME = "CHECK-AUTH";

module.exports = (req, res, next) => {
    try{
        const token = req.param('token');
        const decoded = jwt.verify(token, settings.JWT_KEY)
        res.userData = decoded;
        next();
    } catch (e) {
        res.status(401).json({
            method: NAME,
            message: "Auth fails"
        })
    }
};
