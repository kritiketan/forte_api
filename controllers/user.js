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
      console.log("Body",req.body);
      let registeredUser = await User.findByIdAndUpdate(req.body._id,req.body,{new:true});
      res.send({
        success:true,
        user:registeredUser
      })
    }catch(err){
      return next(err);
    }
    
    
  };
  
  