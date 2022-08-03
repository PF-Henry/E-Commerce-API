// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
const fs = require('fs')
const API_KEY = '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'
const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(API_KEY)


function readTemplate(template) {
  try {
    const data = fs.readFileSync(`${__dirname}/${template}.html`, 'utf8');  
    return data;
  } catch (error) {
    return console.log(error);
  }
}

function configMessage(template){
  
  const config = {
    newSubscriber: {
      msg: 'New subscriber',
      subject: 'Hexatech - Notifications - New Subscriber',
    },
    newUser: {
      msg: 'Successfully registered user - Login now',
      subject: 'Hexatech - Notifications - Registered User',
    },
    forgotPassword: {
      msg: 'Your password has been reset successfully - Review your email for the new password',
      subject: 'Hexatech - Notifications - Password Reset'
    }
  }

  return config[template]
}

async function sendEmail(email, subject, user, template){
  let contentMail = readTemplate(template);
  contentMail = contentMail.replace('{user}', user);

  const msg = {
    to: email, // Change to your recipient
    from: 'pf.henry.2022@gmail.com', // Change to your verified sender
    subject: subject,
    html: contentMail
  }
  
  const response = await sgMail.send(msg).then(()=> {
    return {msg: 'Send email'}
  } ).catch((error) => {
    return {error: 'Error sending email'}
  })
  return response
}


module.exports = sendEmail;
