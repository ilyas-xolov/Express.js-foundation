import { Router } from "express";
import Product from "../models/product.js";
import isAuth from '../service/auth.js'
import jwt from 'jsonwebtoken';
const router = Router();


// --------------------------- MAIN --------------------------- //
router.get('/', async (req, res)=>{ 
    const products = await Product.find().lean(); 
    res.render('index',{ 
        title: 'Course placement',
        products: products.reverse(),
        userId: req.userId ? req.userId.toString() : null
    });

})



// -------------------------------MORE ------------------------------- // 
router.get('/products', async (req, res)=>{
    const myProducts = await Product.find({user_id: req.userId}).populate('user_id').lean();
    res.render('products',{ 
        title: 'Products', 
        isProducts: true,
        myProducts: myProducts.reverse()
    });
})
router.get('/product/:id', async (req, res)=>{
    const id = req.params.id;
    const product = await Product.findById(id).lean();
    res.render('product',{...product});
})




// ------------------------------- CREATE ------------------------------- // 
router.get('/new-add',(req, res)=>{
    if(!isAuth(req.cookies.token)){
        res.redirect('/login'); 
        return
    }

    res.render('new-add',{ 
        title: 'Add new', 
        isNewAdd: true, 
        newAddError: req.flash('newAddError')
    });
})
router.post('/new-add',async (req, res)=>{
    const {name, image, price, description} = req.body
    const user_id = jwt.decode(req.cookies.token).userId;

    if(!name || !image || !price, !description){
        req.flash('newAddError','All field require!!')
        res.redirect('/new-add');
        return
    }
    const products = await Product.create({user_id, ...req.body});
    console.log(products);
    res.redirect('/')
})



// ------------------------------- EDIT ------------------------------- // 
router.get('/edit-product/:id', async (req, res)=>{
    const id = req.params.id;
    const product = await Product.findById(id).lean();
    res.render('edit-product',{
        ...product,
        errorEditProduct: req.flash('errorEditProduct') ?? null
    });
})
router.post('/edit-product/:id', async (req, res)=>{
    const id = req.params.id;
    const {name, price, image, description} = req.body
    if(!name || !price || !image || !description){
        req.flash('errorEditProduct','All fields require!!');
        res.redirect(`/edit-product/${id}`);
        return
    }
    const product = await Product.findByIdAndUpdate(id,req.body,{new: true});
    console.log(product);
    res.redirect('/products')
})



// ------------------------------- DELETE ------------------------------- // 
router.post('/delete-product/:id', async (req, res)=>{
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/');
})


export default router