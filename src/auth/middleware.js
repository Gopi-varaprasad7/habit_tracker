import jwt from 'jsonwebtoken';

export const authMiddleware = (req) => {
    const token = req.headers.authorization || ''

    if(!token) return null;

    try{
        return jwt.verify(token.replace('Bearer',''),process.env.JWT_SECRET);
    }
    catch{
        return null
    }
}