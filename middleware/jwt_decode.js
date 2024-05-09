const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split("Bearer ")[1];
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.auth = decoded;
        return next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth Failed'
        });
    }
};