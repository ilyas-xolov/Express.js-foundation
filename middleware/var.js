import jwt from 'jsonwebtoken';

export default function(req,res,next){
    const Auth = jwt.decode(req.cookies.token) ?? false;
    res.locals.token = Auth?.userId ? true : false;
    next()
}