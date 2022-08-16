// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
const fs = require('fs')


const API_KEY = process.env.API_KEY;
const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(API_KEY)


function generatePassword(user){
  const length = 8;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let newPassword = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    newPassword += charset.charAt(Math.floor(Math.random() * n));
  }
  return `${user}_${newPassword}`;
}

function readHtmlToString(template) {
  try {
    const data = fs.readFileSync(`${__dirname}/${template}.html`, 'utf8');  
    return data;
  } catch (error) {
    return console.log(error);
  }
}

// para dormatear numero de order
const zerofilled = (numero) =>{
  return ('000000'+numero).slice(-5);
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
    resetPassword: {
      msg: 'Your password has been reset successfully - Review your email for the new password',
      subject: 'Hexatech - Notifications - Password Reset'
    },
    newOrder: {
      msg: 'A new purchase order has been generated  - Review your email.',
      subject: 'Hexatech - Notifications - A new purchase order has been generated.',
    },
    orderSent: {
      msg: 'Your Order has been sent - Review your email.',
      subject: 'Hexatech - Notifications - Your Order has been sent.',
    }

  }

  return config[template]
}

function makeOrder(orderItems){

  // const order = {
   
  //   orderItems: [
  //     {
  //       Id: '1',
  //       name: 'Tv',
  //       price: 12500,
  //       quantity: 6,
  //       total: 72500
  //     },
  //     {
  //       Id: '1',
  //       name: 'Tv',
  //       price: 12500,
  //       quantity: 6,
  //       total: 72500
  //     },
  //     {
  //       Id: '1',
  //       name: 'Tv',
  //       price: 12500,
  //       quantity: 6,
  //       total: 72500
  //     }
  //   ]
  // }

  const itemToRowHtml = orderItems.map(item => {
    return `<tr> <td>${item.name}</td> <td>${item.unit_price}</td> <td>${item.quantity}</td> <td>${item.subtotal}</td> </tr>`
  })
  const arrToStr = itemToRowHtml.join('');


  return arrToStr;
}


//*** SENDING MAIL ***/
async function sendEmail(email, user, data, template){
  let contentMail = readHtmlToString(template);
  
  // console.table([email, user, data, template]);
  console.log(email, user, data, template);

  switch (template) {
    case 'newOrder':
      contentMail = contentMail.replace('{orderItems}', makeOrder(data.orderItems));
      contentMail = contentMail.replace('{first_name}', data.first_name);
      contentMail = contentMail.replace('{last_name}', data.last_name); 
      contentMail = contentMail.replace('{orderId}', zerofilled(data.orderId)); 
      contentMail = contentMail.replace('{total_sell}', data.total_sell);
      break;
  
    case 'newSubscriber':
      contentMail = contentMail.replace('{user}', user);
      break;
    case 'newUser':
      contentMail = contentMail.replace('{user}', user);
      break;

    case 'resetPassword':
      contentMail = contentMail.replace('{user}', user);
      contentMail = contentMail.replace('{password}', data);
      break;

    case 'orderSent':
      contentMail = contentMail.replace('{first_Name}', data.first_name);
      contentMail = contentMail.replace('{orderId}', zerofilled(data.orderId));
      contentMail = contentMail.replace('{address}', data.address);
      contentMail = contentMail.replace('{location}', data.location);
      contentMail = contentMail.replace('{departament}', data.departament);
      contentMail = contentMail.replace('{zip_code}', data.zip_code);
      break;

    default:
      break;
  }

  const msg = {
    to: email, // Change to your recipient
    from: 'pf.henry.2022@gmail.com', // Change to your verified sender
    subject: configMessage(template).subject,
    html: contentMail
  }
  
  const response = await sgMail.send(msg).then(()=> {
    console.log('Email sent');
    return {msg: configMessage(template).msg}
  } ).catch((error) => {
    return {error: 'Error sending email'}
  })
  return response
}





module.exports = {
  sendEmail,
  generatePassword
};


// console.log(generatePassword('Sneider'))