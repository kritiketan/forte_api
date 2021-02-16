const User = require('../models/user');
const commonService = require('../util/commonService');
const emailHelper = require('../util/emailHelper');

/**
 * POST /signup
 * Create a new local account.
 */
exports.update = async (req, res, next) => {
    try{
      
      let existingUser = await User.findOne({ email: req.body.email });
      if(!existingUser || !existingUser._id){
        let err = new Error({message:'User does not already exists'});
        return next(err);
      }
      let registeredUser = await User.findByIdAndUpdate(req.body._id,req.body,{new:true});
      res.send({
        success:true,
        user:registeredUser
      })
    }catch(err){
      return next(err);
    }
    
    
  };
  
  
/**
 * POST /signup
 * Create a new local account.
 */
exports.checkDomainAvailable = async (req, res, next) => {
  try{
    if(!req.user || !req.user._id){
      let err = new Error({message:'User does not already exists'});
      return next(err);
    }
    let domainExists = await User.findOne({domainUrl:req.body.domainUrl}).exec();
    let updatedUser={};
    let options =[];
    if(!domainExists){
        updatedUser = await User.findByIdAndUpdate(req.user._id,{domainUrl:req.body.domainUrl,slashUrl:req.body.domainUrl},{new:true});
        domainExists = false;
    }else{
        updatedUser = domainExists;
        domainExists = true;
        //check if any of the new options also match a string in db
        let generatedNames = await commonService.usernameGenerator(req.user.firstName,req.user.lastName);
        for(let url of generatedNames){
          let taken = await User.findOne({domainUrl:url}).exec();
          if(!taken){
            options.push(url)
          }
          if(options.length == 4)break;
        }
        
    }
    
    res.send({
      success:true,
      domainExists:domainExists,
      options:options,
      user:updatedUser
    })
  }catch(err){
    return next(err);
  }
  
};