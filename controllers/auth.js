const Joi = require('joi');
const passport = require('passport');
const User = require('../models/user');
const validator = require('validator');
const commonService = require('../util/commonService');
const { Passport } = require('passport');

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

  exports.forgotPassword = async (req,res,next) =>{
    try{
      let existingUser = await User.findOne({ email: req.body.email });
      if(!existingUser || !existingUser._id){
        let err = new Error({message:'User does not exists'});
        return next(err);
      }
      let token = Math.random().toString(16).substr(6);
      existingUser = await User.findByIdAndUpdate(existingUser._id,{password:'UNASSIGNED',passChangeToken:token},{new :true})
      //TODO: Send email with token
        return res.send({
          success:true,
          token:token,
          message:"Password reset email sent successfully. Please check the email for further instructions."
        })
      
      }catch(err){
        return next(err);
    } 
  }

  exports.changePassword = async (req,res,next) => {
    try{
      let userCondition = { 
        email: req.body.email,
        password:'UNASSIGNED',
        passChangeToken:req.body.token 
      }

      let existingUser = await User.findOne(userCondition);
      if(!existingUser || !existingUser._id){
        let err = new Error({message:'User does not exists'});
        return next(err);
      }
      let update = {
        passChangeToken:'',
        password: await commonService.encryptPassword(req.body.password) 
      }
      existingUser = await User.findByIdAndUpdate(existingUser._id,update,{new :true})
      //TODO: Send email with password change success
        return res.send({
          success:true,
          message:"Password update successful. Login to continue."
        })
      
      }catch(err){
        return next(err);
    }
  }
/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Linkedin Login
 
 */

exports.linkedinLogin = (req,res,next) => {

}

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