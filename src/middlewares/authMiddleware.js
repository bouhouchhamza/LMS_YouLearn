import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddlware = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    if(bearer === undefined || !bearer.startsWith('Bearer ') ){
        return res.status(401).json({
            message: 'token is not valid'
        })
    }
    const codage = bearer.split(' ')[1];
    if(codage === undefined || codage === ''){
        return res.status(401).json({
            message: 'there is no token'
        })
    }
    const token = jwt.verify(codage, process.env.JWT_SECRET);

    const user = await User.findById(token.id);
    if(!user){
        return res.status(401).json({
            message: 'User is not found'
        })
    }
    if(user.status === false){
        return res.status(403).json({
            message: 'access forbiden',
        })
    }
    req.user = user;
    next();
  } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                message: 'Token expired'
            })
        }    
        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                message : 'token error'
            })
        }
        next(error);
}
};
