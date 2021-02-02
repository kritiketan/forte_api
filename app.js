const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const PORT = 8080;
const mongoose = require('mongoose');
const User = require('./models/user');


/**
 * Serve static files from public folder on every request
 * this part runs for EVERY request
 * These are also middle ware that call next() automatically
 */
app.use(morgan('tiny'));
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
/**
 * All App use END
 */


/**
 * Connecting mongoDB
 */
mongoose.connect('mongodb://localhost:27017/forteDB',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'Database connection error'))
db.once('open',()=>{
    console.log('MongoDB connected');
})
/**
 * Connecting mongoDB END
 */



/*
Routes
*/


app.get('/users',async (req,res)=>{
    let users = await User.find();
    res.json({users:users});
})


/**
 * * get 1 user
 * */
app.get('/user/:id',async(req,res)=>{
    const {id} = req.params;
    let user = await User.findById(id);
    res.send({user:user});
})

/**
 * * Add user | Signup
 * */    
app.post('/user',async (req,res)=>{
    let user = new User(req.body);
    let savedResponse = await user.save();
    res.json({success:true,data:savedResponse});
})

/**
 * User Login
 */
app.post('/user/login',async (req,res)=>{
    try{
        console.log(req.body);
        let user = await User.findOne({email:req.body.email,password:req.body.password});
        console.log(user);
        if(user){
            res.json({success:true,data:user});
        }
        res.json({success:false});
    }catch(err){
        res.json({success:false});
    }
    
})

/**
 * Delete User
 */
app.delete('/user/:id',async (req,res)=>{
    await User.findOneAndDelete(req.params.id);
    res.json({success:true});
})

/**
 * * Update products
 * */
app.patch('/user/:id',async(req,res)=>{
    
    await User.findOneAndUpdate(req.body);
    res.json({updsucessated:true})
})
// app.get('/r/:sub/:post',(req,res)=>{
//     const {sub,post} = req.params;
//     res.json(`this is ${sub} and also ${post}`)
//  })

/**
 * Query string handling
 * query string urls parts with ?
 * http://localhost:8080/query?a=2&b=1
 */
 
 app.get('/query',(req,res)=>{
     const query  = req.query;
     console.log(query)
     res.json(`this is ${query.a}`)
 })
 
//Keep at the very end always
app.get('*',(req,res)=>{
    res.status(404).send("Naah")
})

app.listen(PORT,()=>{
    console.log("Forte Api server live on port:",PORT);
})