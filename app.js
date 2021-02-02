const express = require('express');
const app = express();
const path = require('path');
const PORT = 8080;
const mongoose = require('mongoose');
const User = require('./models/user');
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


app.listen(PORT,()=>{
    console.log("Forte Api server live on port:",PORT);
})

/*every request goes through this irrespective of route
so we can add any checks here like

Headers
Authorizaition
Validators
 app.use(function(req,res){
      console.log("In app use",req)
      res.send({success:true,message:"I got you"});
 })
*/

app.use(express.static('public'))
console.log(process.env.NODE_ENV)
/**
 * For parsing different kinds of data types
 */
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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
 * * Add user
 * */
    
app.post('/user',async (req,res)=>{
    let user = new User(req.body);
    let resp = await user.save();
    console.log(resp);
    res.json(resp);

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