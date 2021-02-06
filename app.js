const express = require('express');
const app = express();
const path = require('path');

//Routes
const userRoutes = require('./routes/user/index');
//Util
const morgan = require('morgan');
const AppError = require('./AppError');
const mongoose = require('mongoose');
const PORT = 8080;
/**
 * Serve static files from public folder on every request * this part runs for EVERY request* These are also middle ware that call next() automatically
 */
app.use(morgan('dev')); //Logs each request
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Connecting mongoDB
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

//Route Declaration
app.use('/user',userRoutes);


/**
 * Error handling
 */
app.use((err,req,res,next)=>{
    const {status = 500,message='Something went wrong'}
    console.log("Works when an error occurs");
    res.status(500).send(message);      

    //Handle errors and move on
    //next(err) -> if passed without err as arg does not work
})

app.listen(PORT,()=>{
    console.log("Forte Api server live on port:",PORT);
})