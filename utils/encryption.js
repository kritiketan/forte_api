const bcrypt = require('bcrypt');

const encrytPassword = async (pass) =>{
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pass,salt);
    return hash;
}

const checkPassword = async (pass,encryptedPass) => {
    return result = await bcrypt.compare(pass,encryptedPass)
}

module.exports = {
    encrytPassword,
    checkPassword
}