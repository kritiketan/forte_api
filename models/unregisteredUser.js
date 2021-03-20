const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const unregUserSchema = new Schema({

    email:{
        type:String
    },
    source:{
        type:String
    },
    converted:{
        type:Boolean,
        default:false
    }
})

const UnregUser = mongoose.model('unregisteredUser',unregUserSchema);
module.exports = UnregUser;