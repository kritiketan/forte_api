const express = require('express');
const router = express.Router();
const Joi = require('joi');
const User = require('')


//C: Signup  
router.post('/user',async (req,res)=>{
    const userSchema = Joi.object({
        firstName:Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
        lastName:Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
        password:Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })

    })
    try{
        const { error, value } = userSchema.validate(req.body)
        if(error){
            throw new Error();
        }
        let user = new User(req.body);
        let savedResponse = await user.save();
        res.json({success:true,data:savedResponse});
    }catch(err){

    }
})

//R

router.get('/:id',async(req,res)=>{
    const {id} = req.params;
    let user = await User.findById(id);
    res.send({user:user});
})

//U


//D

module.exports = router;


app.get('/users',async (req,res)=>{
    try{
        let users = await User.find();
        res.json({users:users});
    }catch(err){
        throw new AppError(500,'Internal server error');
    }
    
})





/**
 * User Login
 */
app.post('/user/login',async (req,res)=>{
    try{
        console.log(req.body);
        let user = await User.findOne({email:req.body.email,password:req.body.password});
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


