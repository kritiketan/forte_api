const axios = require('axios').default;
const moment = require('moment');
// const url = require('url');
// const params = new url.URLSearchParams({ foo: 'bar' });
// axios.post('http://something.com/', params.toString());
const commonService = require('../util/commonService');
const https = require('https')
const instance = axios.create({
    baseURL: 'https://api.linkedin.com/v2/me',
    timeout: 10000,
    headers: {
        'X-Custom-Header': 'foobar',
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
    }
  });



exports.linkedinActions = async (code)=>{
    try{
        let token = await getLnToken(code);
        if(token.access_token){
            let profile = await getLnProfile(token.access_token);
            let email = await getLnEmailAddress(token.access_token);
            if(profile && email){
                let linkedinDetails = {
                    firstName:profile.localizedFirstName,
                    lastName:profile.lastName.localized.en_US,
                    linkedinId:profile.id,
                    email:email.emailAddress,
                    linkedinImage:profile.profilePicture.displayImage,
                    accessToken:token.access_token,
                    expiresOn:moment().add(token.expires_in, 'seconds').format(),
                }
                console.log(linkedinDetails)
                return linkedinDetails;
            }
        }
        return false;
    }catch(error){
        return false;
    }
}

async function getLnToken(code){
    return new Promise(async (resolve,reject)=>{
        let url = await commonService.generateLinkedinUrl('acessToken',code);
        axios.request(url)
        .then((response)=>{
            if(response.status == 200 && response.data && response.statusText == 'OK'){
                resolve(response.data)
            }else{
                reject(false)
            }
        }).catch((error)=>{
            reject(false)
        })

    })
}

async function getLnProfile(accessToken){
    return new Promise(async (resolve,reject)=>{
        const options = {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`, 
            }
          };
          instance.request(options)
          .then((response)=>{
            if(response.data && response.status == 200){
                resolve(response.data);
            }else{
                reject(false);
            }
          })
          .catch((error) => {
              reject(false);
          })
    })
}

async function getLnEmailAddress(accessToken){
    return new Promise((resolve,reject)=>{
        const options = {
            url:'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`, 
            }
          };
          instance.request(options)
          .then((response)=>{
              if(response.data && response.status == 200 && response.data.elements[0] 
                && response.data.elements[0]['handle~']){
                resolve(response.data.elements[0]['handle~']);
              }else{
                  reject(false)
              }
          })
          .catch((error)=>{
              reject(false);
          })

    })
}
/* 
exports.getLinkedinAccessToken = async function(code){
   
    const linkedinResponse = new Promise(function(resolve,reject){
        
        axios.request(url).then(async (response)=>{
            if(response.status == 200 && response.data && response.statusText == 'OK'){
                let accessToken = response.data.access_token;
                let profileData = await getLinkedinProfile(accessToken);
            }
        })
        .catch((error)=>{
            if (error.response) {
                console.log('error.response data ::',error.response.data);
                console.log('error.response status ::',error.response.status);
                // console.log('error.response headers ::',error.response.headers);
              } else if (error.request) {
                console.log('error.request ::',error.request);
              } else {
                console.log('Error ::', error.message);
              }
              return reject(error);
        })
    })
    return linkedinResponse;
    
}
*/
/*
let getLinkedinProfile = async function(accessToken){
    return new Promise(function(resolve,reject){
        const options = {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`, 
            }
          };
          instance.request(options).then((response)=>{
            console.log("data",response.data)
            resolve(response.data);
        })
        .catch((error)=>{
          if (error.response) {
              // Request made and server responded
              console.log('error.response data :Profile:',error.response.data);
              console.log('error.response status :Profile:',error.response.status);
            } else if (error.request) {
              console.log('error.request :Profile:',error.request);
            } else {
              console.log('Error :Profile:', error.message);
            }
            reject(error);
        })
    })
    
      
}
 */