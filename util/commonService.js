
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

let generateLinkedinUrl = function(type,code =""){
    let url = '';
    switch(type){
        case 'oauth':
            url = "https://www.linkedin.com/oauth/v2/authorization"+
            "?response_type=code"+
            "&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Foauth%2Flinkedin&scope=r_liteprofile%20r_emailaddress&"+
            "client_id=860ezpkd3wiglx"
        break;
        case 'acessToken':
            url = "https://www.linkedin.com/oauth/v2/accessToken"+
             "?grant_type=authorization_code"+
             "&client_id=860ezpkd3wiglx"+
             "&client_secret=3beARGv6nNfihbFm"+
             "&code="+code+
             "&redirect_uri=http://localhost:4200/oauth/linkedin";
        break;
    }
      
    return url;
}


module.exports = {
    usernameGenerator,
    encryptPassword,
    generateLinkedinUrl
}