const usernameExtensions = [
    'x','nest','verse','n','sy','ella','sio','iva','que'
]

let usernameGenerator = async function(user){
    let usernameArray = [];
    /*extensions related option*/
    for(const term of usernameExtensions){
        usernameArray.push(user.firstName+term)
    }
    for(const term of usernameExtensions){
        usernameArray.push(user.firstName+user.lastName+term)
    }
    /*name based combinations*/
    for(let i=0;i<user.firstName.length;i++){
        usernameArray.push(user.firstName[i]+user.lastName);
    }
    for(let i=0;i<user.lastName.length;i++){
        usernameArray.push(user.firstName+user.lastName[i]);
    }
    return usernameArray;
} 


module.exports = {
    usernameGenerator
}