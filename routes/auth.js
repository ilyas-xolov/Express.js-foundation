import { Router } from "express";
import bcrypt from 'bcrypt';
import User from "../models/user.js";
import { generateJWT } from "../service/token.js";
import isAuth from '../service/auth.js'
const router = Router();

// -------------------------------------- LOGOUT -------------------------------------- //
router.get('/logout', (req, res) =>{
    res.clearCookie('token');
    res.redirect('/');
})

// -------------------------------------- LOGIN -------------------------------------- //
router.get('/login',(req,res)=>{ 

    if(isAuth(req.cookies.token)){
        res.redirect('/');
        return;
    }
    res.render('login',{ 
        title: 'Sign In', 
        isLogin: true, 
        loginError: req.flash('loginError')
    });
})
router.post('/login', async (req,res)=>{

    const {email,password} = req.body
    if(!email || !password){
        req.flash("loginError", 'Require email and password');
        res.redirect('/login')
        return
    }
    const exitUser = await User.findOne({email});
    if(!exitUser){
        req.flash("loginError", 'Invalid email or password');
        res.redirect('/login')
        return
    }
    const isPassCorrect = await bcrypt.compare(password, exitUser.password);
    if(!isPassCorrect){
        req.flash("loginError", 'Invalid email or password');
        res.redirect('/login')
        return
    }
    const token = generateJWT(exitUser._id);
    res.cookie('token',token,{httpOnly:true,secure: true});
    res.redirect('/');
})

// -------------------------------------- REGISTERATION -------------------------------------- //
router.get('/register', ( req, res )=>{
    if(isAuth(req.cookies.token)){
        res.redirect('/');
        return;
    }
    res.render('register',{ 
        title: 'Sign Up', 
        isRegister: true, 
        registerError: req.flash('registerError')  
    });
})
router.post('/register', async ( req, res )=> {

    const {firstName, lastName, email, password} = req.body
    if(!firstName || !lastName || !email || !password){
        req.flash("registerError", 'Require email and password');
        res.redirect('/register')
        return
    }
    const isExist = await User.findOne({email});
    
    if(isExist?.email){
        req.flash("registerError", 'User already registered.');
        res.redirect('/register')
        return
    }
    const hashedPassword = await bcrypt.hash(password,10);
	const userData = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: hashedPassword,
	}
    const user = await User.create(userData);
    const token = generateJWT(user._id);
    console.log(token);
    res.cookie('token',token,{httpOnly:true, secure: true});
    res.redirect('/')
})

export default router