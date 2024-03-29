const Joi = require('joi');
const passport = require('passport');
const User = require('../models/user');
const validator = require('validator');
const commonService = require('../util/commonService');
const { Passport } = require('passport');
const apiController = require('../controllers/api');

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


exports.linkedinLogin = async (req,res,next) => {
  let url = await commonService.generateLinkedinUrl('oauth');
  res.json({
    success:true,
    url:url
  })
}

exports.linkedinLoginCallback = async (req,res,next) => {
  try{
    let apiResponse = await apiController.linkedinActions(req.body.code);
    if(apiResponse){
      let searchByEmail = {
        email: apiResponse.email.toLowerCase()
      } 
      let existingUser = await User.findOne(searchByEmail);
      if(!existingUser || !existingUser._id){
        const user = new User({
          email: apiResponse.email,
          password: 'oauth',
          firstName:apiResponse.firstName,
          lastName:apiResponse.lastName || '',
          linkedin:{
            profileId:apiResponse.linkedinId,
            image:apiResponse.linkedinImage,
            accessToken:apiResponse.accessToken,
            expiresOn:apiResponse.expiresOn
          }
        });
        let url = await createDomainUrl(apiResponse.firstName,apiResponse.lastName);
        user['slashUrl'] = url;
        user['domainUrl'] = url;
        existingUser = await user.save();
      }else{
        let update ={
          linkedin:{
            profileId:apiResponse.linkedinId,
            image:apiResponse.linkedinImage,
            accessToken:apiResponse.accessToken,
            expiresOn:apiResponse.expiresOn
          } 
        }
        existingUser = await User.findByIdAndUpdate(existingUser._id,update,{new :true})
      }
      req.logIn(existingUser,(err) => {
        if(err)next(err);
      })
      res.send({
        success:true,
        user:existingUser,
        message:'Log in successful'
      })
    }else{
      res.send({
        success:false,
        message:'Unable to login using Linkedin. Please use other options.'
      })
    }
    
  }catch(error){
    return next(err);
  }
  
}

exports.socialLogin = async (req,res,next) => {
  try{
    let searchByEmail = {
      email: req.body.email.toLowerCase()
    } 
    let existingUser = await User.findOne(searchByEmail);
    if(!existingUser || !existingUser._id){
      const user = new User({
        email: req.body.email,
        password: 'oauth',
        firstName:req.body.firstName,
        lastName:req.body.lastName || ''
      });

      if(req.body.provider == 'GOOGLE'){
        user['google'] = {
          authToken:req.body.authToken,
          profileId:req.body.id,
          image:req.body.photoUrl
        }
      }else if(req.body.provider == 'FACEBOOK'){
        user['facebook'] = {
          authToken:req.body.authToken,
          profileId:req.body.id,
          image:req.body.photoUrl
        }
      }

      let url = await createDomainUrl(req.body.firstName,req.body.lastName);
        user['slashUrl'] = url;
        user['domainUrl'] = url;
        existingUser = await user.save();
    }else{
      let update = {};
      if(req.body.provider == 'GOOGLE'){
        update ={
          google:{
            authToken:req.body.authToken,
            profileId:req.body.id,
            image:req.body.photoUrl
          }
        }
      }else if(req.body.provider == 'FACEBOOK'){
        update ={
          facebook:{
            authToken:req.body.authToken,
            profileId:req.body.id,
            image:req.body.photoUrl
          }
        }
      }
      existingUser = await User.findByIdAndUpdate(existingUser._id,update,{new :true})
    }
    req.logIn(existingUser,(err) => {
      if(err)next(err);
    })
    res.send({
      success:true,
      user:existingUser,
      message:'Log in successful'
    })

  }catch(error){
    console.log(error)
    return next(error);
  }
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
  return firstName;
}


/**
 * POST /signup
 * Create a new local account.
 */
exports.waitlist = async (req, res, next) => {
  try{
  
    let existingUser = await User.findOne({ email: req.user.id });
    //send welcome email and add email to unregistered users list
    res.send({
      success:true,
      user:existingUser
    })
  }catch(err){
    return next(err);
  }
  
  
};
