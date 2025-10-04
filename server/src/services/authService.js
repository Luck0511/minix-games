//utility imports
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
//other imports
import {appConfig} from "../config/config.js";

/*==== COOKIES ====*/

    //sets cookie to include with response, secure and dynamic based on .env file and production env
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

    //hashes password
    export const passwordHash = async (password) => {
        const saltRounds = appConfig.auth.bcryptRounds
        return await bcrypt.hash(password, saltRounds);
    }
    //verifies password hashed and input password
    export const verifyPassword = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    }

//generate JWT token
export const generateJWT = (payload) => {
    try{
        return jwt.sign(payload, appConfig.auth.jwtSecret, {expiresIn: appConfig.auth.jwtExpires});
    }catch(err){
        console.error('Error generating JWT:', err);
        return null;
    }
}

//middleware to verify JWT in incoming requests
export const verifyJWT = (req, res, next) => {
    // get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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


