import jwt from "jsonwebtoken";
import isAuth from "../service/auth.js";
import User from "../models/user.js"

export default async function(req,res,next) {
    const token = req.cookies.token;
    if(!isAuth(token)){
        next();
        return
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decode.userId);
    req.userId = user._id;
    next()
}