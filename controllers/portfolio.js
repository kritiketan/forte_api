const User = require('../models/user');

exports.getUserProfile = async (req, res, next) => {
    console.log('Params',req.params);
    const {slashUrl} = req.params;
    //Add validation
    let existingUser = await User.findOne({ slashUrl: slashUrl});
    if(!existingUser || !existingUser._id){
      let err = new Error({message:'User does not already exists'});
      return next(err);
    }
    res.send({
        success:true,
        user:existingUser
    })
}