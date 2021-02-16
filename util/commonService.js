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


module.exports = {
    usernameGenerator
}