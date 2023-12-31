const jwt = require("jsonwebtoken");
const moment = require("moment");
let jwtidCounter = 0;
let blacklist = [];

const JwtService = {
    jwtSign: (_payload, options) => {
        try {
            if (process.env.SERVER_JWT !== "true")
                new Error("[JWT] Fastify JWT flag is not setted");

            console.log("[JWT] Generating fastify JWT sign");

            const payload = JSON.parse(JSON.stringify(_payload));
            jwtidCounter = jwtidCounter + 1;
            return jwt.sign({payload}, process.env.SERVER_JWT_SECRET, {
                expiresIn: options.expiresIn,
                jwtid: jwtidCounter + "",
            });

        } catch (error) {
            console.log("[JWT] Error during fastify JWT sign");
            return error;
        }
    },

    jwtGetToken: (request) => {
        try {
            if (process.env.SERVER_JWT !== "true") {
                console.log("[JWT] JWT flag is not set");
                throw new Error("[JWT] JWT flag is not set");
            }
            if (!request?.headers?.authorization || !request?.headers?.authorization?.startsWith("Bearer ")) {
                console.log("[JWT] JWT token not provided or invalid format");
                throw new Error("[JWT] JWT token not provided or invalid format");
            }
            const token = request.headers.authorization.split(" ")[1];
            return token;
        } catch (error) {
            console.log("[JWT] Error getting JWT token:", error.message);
            throw error;
        }
    },


    jwtVerify: (token) => {
        try {
            if (process.env.SERVER_JWT !== "true")
                new Error("[JWT] JWT flag is not setted");

            return jwt.verify(
                token,
                process.env.SERVER_JWT_SECRET,
                (err, decoded) => {
                    blacklist.forEach((element) => {
                        if (
                            element.jti === decoded.jti &&
                            element.iat === decoded.iat &&
                            element.exp === decoded.exp
                        )
                            new err;
                    });

                    if (err != null) throw err;
                    return decoded.payload;
                }
            );
        } catch (error) {
            console.log("[JWT] Error getting JWT token");
            return error;
        }
    },

    jwtBlacklistToken: (token) => {
        try {
            while (
                blacklist.length &&
                moment().diff("1970-01-01 00:00:00Z", "seconds") > blacklist[0].exp
                ) {
                console.log(
                    `[JWT] Removing from blacklist timed out JWT with id ${blacklist[0].jti}`
                );
                blacklist.shift();
            }
            const {jti, exp, iat} = jwt.decode(token);
            console.log(`[JWT] Adding JWT ${token} with id ${jti} to blacklist`);
            blacklist.push({jti, exp, iat});
        } catch (error) {
            console.log("[JWT] Error blacklisting fastify JWT token");
            throw error;
        }
    },
};

module.exports = JwtService;