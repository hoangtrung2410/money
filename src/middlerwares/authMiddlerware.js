const db = require('../models');
const JwtService = require("../services/jwtServices.js");
const {BadTokenError} = require("../utils/apiError.js");

const authMiddleware = async (req, res, next) => {
    try {
        if (process.env.SERVER_JWT === "false") return next();
        const token = JwtService.jwtGetToken(req);
        const decoded = JwtService.jwtVerify(token);
        req.user = decoded.user;
        console.log("1111 >>> " + decoded.user)
        return next();
    } catch (e) {
        console.log(e)
        res.status(401).json(
            {JSON: new BadTokenError()}
        )
    }
};
const authAdminMiddleware = async (req, res, next) => {
    try {
        if (process.env.SERVER_JWT === "false") return next();
        const token = JwtService.jwtGetToken(req);
        console.log("token 123456>>> " + token)
        const decoded = JwtService.jwtVerify(token);
        req.admin = decoded.admin;
        console.log("1111 >>> " + decoded.admin.id)
        return next();
    } catch (e) {
        console.log(e)
        res.status(401).json(
          {JSON: new BadTokenError()}
        )
    }
}

module.exports = {
    authMiddleware,
    authAdminMiddleware
}