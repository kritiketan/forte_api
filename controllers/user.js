const User = require('../models/user');


/**
 * POST /signup
 * Create a new local account.
 */
exports.update = async (req, res, next) => {
    try{
      //Add validation
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
    console.log('domain',req.body)
    let domainExists = await User.findOne({domainUrl:req.body.domainUrl}).exec();
    let updatedUser={};
    let options =[];
    if(!domainExists){
        updatedUser = await User.findByIdAndUpdate(req.user._id,{domainUrl:req.body.domainUrl},{new:true});
        domainExists = false;
    }else{
        updatedUser = domainExists;
        domainExists = true;
        //generate url options
        options.push("Option1")
        options.push("Option2")
        options.push("Option2")
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