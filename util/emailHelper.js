const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")


let sendSignupEmail = async ()=>{
    console.log('Send mail');
    console.log(process.env.SENDGRID_API_KEY)
    const msg = {
        to: 'kritiketan7199@gmail.com', // Change to your recipient
        from: 'kritiketan7199@gmail.com', // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
      
      sgMail.send(msg).then((res) => {
        
        return true;
         })
        .catch((error) => {
            console.log('Error at this',error)
            return false
        })

}

module.exports = {
    sendSignupEmail
};