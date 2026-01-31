//utility imports
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
//other imports
import {appConfig} from "../config/config.js";

/*==== COOKIES ====*/

    /**
     * Sets cookie to include with response, secure and dynamic based on .env file and production env
     * @param res response reference
     * @param {String} token JWT token
     * @returns ads the cookies to server response
     **/
    export const setAuthCookie = (res, token) => {
        const isProduction = appConfig.app.env === 'production';

         return res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax',
            maxAge: appConfig.auth.cookieMaxAge
        })
    }


/*==== PASSWORDS ====*/

    /**
     * Hashes password given based on server environment
     * @param {String} password non hashed password
     * @returns {Promise<void|any>}
     **/
    export const passwordHash = async (password) => {
        const saltRounds = appConfig.auth.bcryptRounds
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * verifies password hashed and input password using async bcrypt compare to avoid blocking app
     * @param {String} password non hashed password by user input
     * @param {String} hashedPassword hashed password retrieved by DB
     * @returns {Promise<Boolean>} true or false based on password matching
     **/
    export const verifyPassword = async (password, hashedPassword) => {
        try{
            const match = await bcrypt.compare(password, hashedPassword);
            return !!match;
        }catch(err){
            console.error('Error comparing passwords: ', err);
            return false;
        }
    }


/*==== JWT TOKES ====*/

    /**
     * Generate JWT token used for register and login
     * @param {{}} payload non hashed password by user input
     * @returns {String} JWT token in string format
     **/
    export const generateJWT = (payload) => {
        try{
            return jwt.sign(payload, appConfig.auth.jwtSecret, {expiresIn: appConfig.auth.jwtExpires});
        }catch(err){
            console.error('Error generating JWT:', err);
            return null;
        }
    }

    /**
     * Middleware to verify JWT in incoming requests --> to use for protected routes that needs access control
     * @param req request reference
     * @param res response reference
     * @param next next middleware/handler reference
     * @returns sets response status code if any errors are detected
     **/
    export const verifyJWT = (req, res, next) => {
        //extract token from Cookies
        const token = req.cookies.token
        //error on empty token
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        try {
            // Verify token and add user info to request, allow access next
            req.user = jwt.verify(token, appConfig.auth.jwtSecret);
            next();
        } catch (error) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
    }

    export const APILimiter = rateLimit({
        windowMs: 5*60*1000,
        max: 1000,
        keyGenerator: (req)=>{
            const token = req.cookies.token;
            return token || req.ip;
        },
        handler: (req, res) => {
            res.status(429).json({
                error: 'Too many requests',
                user: req.user?.playerName || req.ip
            });
        },
        standardHeaders: true,
        legacyHeaders: false,
    })

