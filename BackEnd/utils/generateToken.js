// F:\Mehnat\BackEnd\utils\generateToken.js

import jwt from 'jsonwebtoken';

// Use a long, complex, HARDCODED key temporarily to ensure consistency
// Change EXPLICIT_SECRET to your .env value
const EXPLICIT_SECRET = '6bf6a2dddb2fb2da45b4c0373b1ca931d14ea0a7b5594b1c7f51e8013bf46f6b';
const generateToken = (userId) => {
    return jwt.sign({ userId }, EXPLICIT_SECRET, {
        expiresIn: '30d',
    });
};

export default generateToken;