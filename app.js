const express = require('express');
const path = require('path');

//Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const portfolioRoutes = require('./routes/portfolio');
const User = require('./models/user');

//Packages
const logger = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const chalk = require('chalk');
const lusca = require('lusca');
const errorHandler = require('errorhandler');

dotenv.config({ path: '.env' });
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

const db = mongoose.connection;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_ATLAS_URI);
db.on('error',(err)=>{
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
})
db.once('open',()=>{
    console.log('%s MongoDB connection established.', chalk.green('✓'));
})


/**
 * Express configuration.
 */

app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080)
app.use(logger('dev'));
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors(
    {   
        origin:"*",
        // methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders:'Content-Type,Authorization',
        credentials:true
    }
))

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:true,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    saveUninitialized:true,
    store: new MongoStore({
        url: process.env.MONGODB_ATLAS_URI,
        autoReconnect: true,
        collection: 'sessions'
      })
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
// app.disable('x-powered-by');
/**
 * API keys and Passport configuration.
 */


// app.use((req, res, next) => {
//     // After successful login, redirect back to the intended page
//     if (!req.user
//       && req.path !== '/login'
//       && req.path !== '/signup'
//       && !req.path.match(/^\/auth/)
//       && !req.path.match(/\./)) {
//       req.session.returnTo = req.originalUrl;
//     } else if (req.user
//       && (req.path === '/account' || req.path.match(/^\/api/))) {
//       req.session.returnTo = req.originalUrl;
//     }
//     next();
//   });

app.use('/auth',authRoutes);
app.use('/user',passportConfig.isAuthenticated,userRoutes);
app.use('/portfolio',portfolioRoutes);
/**
 * Error handling
 */
app.use((err,req,res,next)=>{
    const {status = 500,message='Something went wrong'} = err;
    res.status(500).send({error:message});      
})


/**
 * Error Handler.
 

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
  } else {
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send('Server Error');
    });
  }
 */ 

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
});