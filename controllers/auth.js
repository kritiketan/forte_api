const Joi = require('joi');
const passport = require('passport');
const User = require('../models/user');
const validator = require('validator');
const commonService = require('../util/commonService');

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
        if (err) { 
          let err = new Error('Something went wrong');
          return next(err); 
        }
        if (!user) {
          return res.send({
            success:false,
        })
          // let errInfo = new Error('User does not exist');
          // return next(errInfo);
        }
        req.logIn(user, (err) => {
        if (err)return next(err)
        
        res.cookie('name','test');
        return res.send({
            success:true,
            user:user
        })
      });
    })(req, res, next);
  };

  


/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      
      res.send({
        success:true
      })
    });
  };


/**
 * POST /signup
 * Create a new local account.
 */
exports.signup = async (req, res, next) => {
  try{
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      firstName:req.body.firstName,
      lastName:req.body.lastName || '',
    });

    let existingUser = await User.findOne({ email: req.body.email });
    if(existingUser && existingUser._id){
      let err = new Error({message:'User already exists'});
      return next(err);
    }

    let url = await createDomainUrl(req.body.firstName,req.body.lastName);
    user.slashUrl = url;
    user.domainUrl = url;
      
      let registeredUser = await user.save();
      req.logIn(registeredUser,(err) => {
        if(err)next(err);
      })
      res.send({
        success:true,
        user:registeredUser
      })
  }catch(err){
    return next(err);
  }
  
  
};

async function createDomainUrl(firstName,lastName){
  let domainExists = await User.findOne({domainUrl:firstName}).exec();
  if(domainExists){
    let generatedNames = await commonService.usernameGenerator(firstName,lastName)
    for(let url of generatedNames){
      let taken = await User.findOne({domainUrl:url}).exec();
      if(!taken){
        return url;
      }
    }
  }
}

exports.forgot = (req,res,next)=>{

}

exports.reset = (req,res,next)=>{

}