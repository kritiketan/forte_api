const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:false
    },
    password:{
        type:String
    },
    phone:{
        type:String
    }
})

//created a virtual variable when returning the model
userSchema.virtual('fullName')
    .get(function(){return this.firstName + ' ' +this.lastName})

//Also known as mongoose middleware
userSchema.pre('save',(next)=>{
    //encrypt password
    next();
})

const User = mongoose.model('User',userSchema);
module.exports = User;