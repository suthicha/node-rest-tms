const jwt = require('jsonwebtoken');
const settings = require('../../settings');
const helper = require('../utils/helper');
const User = require('../adapters/userAdapter');
const NAME = "userController";

exports.auth = (req, res, next) => {
    try {
        const { userId, password } = req.body;
        User.auth(userId, password, (data, error)=>{
            if (error){
                helper.sendJson(req, res, 500, NAME, {
                    error: error.message
                });
            } else {
                
                if (data.length === 0 || data[0].LoggedStatus === 404) {
                    helper.sendJson(req, res, 404, NAME, { 
                        message: 'auth fail'
                    });
                } else {
                    const token = jwt.sign(
                        {
                            userId: data[0].LoginName
                        }, 
                        settings.JWT_KEY,
                        {
                            expiresIn: 3600    
                        }
                        );
                    helper.sendJson(req, res, 200, NAME, {
                        message: "auth successfully",
                        token: token
                    });
                };
            };
        });
    } catch (e) {
        helper.sendJson(req, res, 500, NAME, e.message);
    }
};
