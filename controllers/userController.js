const User = require('../models/user');
const userController;

userController.createNewUser = async function(req,res){
    await User.save()
}


module.export = {

}