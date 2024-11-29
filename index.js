import express from 'express'
import {engine,create} from 'express-handlebars'
import flash from 'connect-flash';
import session from 'express-session';
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import varMiddleware from './middleware/var.js';
import userMiddleware from './middleware/user.js';
import hbsHelpers from './utils/index.js'; 

import routerProduct from './routes/product.js';
import routerAuth from './routes/auth.js';

dotenv.config()
const app = express() 

const hbs = create({ defaultLayout: 'main', extname: 'hbs', helpers: hbsHelpers})

// Cast to hbs

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

// Service settings
app.use(session({secret:'CP192837465', resave: false, saveUninitialized: false}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public")); 
app.use(cookieParser());
app.use(express.json());
app.use(flash());
app.use(varMiddleware)
app.use(userMiddleware)
// Render pages
app.use(routerAuth);
app.use(routerProduct);

const startApp =()=>{ 
    const PORT = process.env.PORT || 7100;
    app.listen(PORT,()=> console.log('Service is running on port:',PORT))

    mongoose.connect(process.env.MONGO_DB).then(() => {
        console.log('Connection succesfully with MongoDB');
    }).catch((err) => {
        console.error('Connection error with MongoDB:', err.message)
    });
}

startApp();