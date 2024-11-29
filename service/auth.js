import jwt from 'jsonwebtoken';

const isAuth = (token)=>{
    const Auth = jwt.decode(token) ?? false;
    return Auth?.userId ? true : false;
}

export default isAuth