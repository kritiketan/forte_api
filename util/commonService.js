
const bcrypt = require('bcrypt');

const usernameExtensions = [
    'x','nest','verse','n','sy','ella','sio','iva','que'
]

let usernameGenerator = async function(firstName,lastName){
    let usernameArray = [];
    /*extensions related option*/
    for(const term of usernameExtensions){
        usernameArray.push(firstName+term)
    }
    for(const term of usernameExtensions){
        usernameArray.push(firstName+lastName+term)
    }
    /*name based combinations*/
    for(let i=0;i<firstName.length;i++){
        usernameArray.push(firstName[i]+lastName);
    }
    for(let i=0;i<lastName.length;i++){
        usernameArray.push(firstName+lastName[i]);
    }
    return usernameArray;
} 

let encryptPassword = async function(passwordString){
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(passwordString,salt);
    return hash;
}


module.exports = {
    usernameGenerator,
    encryptPassword
}