const mongoose = require('mongoose');
const User = require('./models/user');

/**
 * Connecting mongoDB
 */
mongoose.connect('mongodb://localhost:27017/forteDB',{useNewUrlParser:true})
    .then(()=>{
        console.log('MongoDB connected. in first load');
    })
    .catch(err => {
        console.log('MongoDB connection failed. in first load',err);
    })


const userAdd = new User({
    firstName:'Kittu',
    lastName:'Sharma',
    email:'kritiketan@gmail.com',
    phone:'0498334911',
    password:'test2'
})

userAdd.save()
    .then((res)=> console.log(this.fullName));

