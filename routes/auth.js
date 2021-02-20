const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const passportConfig = require('./../config/passport');


router.post('/login',authController.login)
router.post('/forgot',authController.forgotPassword)
router.post('/changePassword',authController.changePassword)
router.post('/linkedin',authController.linkedinLogin)
router.post('/signup',authController.signup)
router.get('/logout',authController.logout)
router.post('/forgot',authController.signup)
router.post('/reset/:id',authController.signup)



/**
 * Get User
 */

/**
 * Delete User

 Validation

 const userSchema = Joi.object({
        firstName:Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
        lastName:Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
        password:Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        repeat_password: Joi.ref('password'),
        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })

    })
     // const { error, value } = userSchema.validate(req.body)
        // if(error){
        //     throw new Error();
        // }
app.delete('/user/:id',async (req,res)=>{
    await User.findOneAndDelete(req.params.id);
    res.json({success:true});
})



//R

router.get('/:id',async(req,res)=>{
    const {id} = req.params;
    let user = await User.findById(id);
    res.send({user:user});
})

//U


//D
 */
module.exports = router;







