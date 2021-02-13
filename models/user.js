const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String
    },
    bio:{
        type:String
    },
    location:{
        type:String
    },
    website:{
        urlSlash:{
            type:String,
            default:''
        },
        urlDomain:{
            type:String,
            default:''
        },
        custom:{
            type:String,
            default:''
        },
        personal:{
            type:String,
            default:''
        }
    }
}, { timestamps: true })


//created a virtual variable when returning the model
userSchema.virtual('fullName')
    .get(function(){return this.firstName + ' ' +this.lastName})

//Right before saving
userSchema.pre('save',async function(next){
    try{
        const user = this;
        if (!user.isModified('password')) { return next(); }//Check if this works
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(user.password,salt);
        user.password = hash;
        next();//calls save
    }catch(err){
        next(err);
    }
    
})

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  };

/**
 * Login
 * @param { String: Email } username 
 * @param { String } password 
 */
userSchema.methods.findAndValidate = async function(username,password){
    const foundUser = await this.findOne({username});
    if(!foundUser)throw new Error('No user found');
        const result = await bcrypt.compare(password,foundUser.password);
        if(!result){
            return 
        }
        return {
            success:result,
            user:foundUser
        }
    
    
}

const User = mongoose.model('user',userSchema);
module.exports = User;