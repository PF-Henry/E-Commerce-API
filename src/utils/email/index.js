// const nodemailer = require("nodemailer");



// // const transporter = nodemailer.createTransport({
// //   service: 'gmail',
// //   port:465,
// //   secure: true, // true for 465, false for other ports
// //   logger: true,
// //   debug: true,
// //   secureConnection: false,
// //   auth: {
// //       user: 'pf.henry.2022@gmail.com', 
// //       pass: app_key, 
// //   },
// //   tls:{
// //       rejectUnAuthorized: false
// //   }
// // })

                

// // const transporter = nodemailer.createTransport('smtps://pf.henry.2022@gmail.com:yqqnsrytsdgzrhjc@smtp.gmail.com');

// async function sendEmail() {
//   try {

//     const app_key = "yqqnsrytsdgzrhjc";
//     // const app_key = "Henry_2022";

//     // const transporter = nodemailer.createTransport({
//     //   service: "smtps.gmail.com",
//     //   port: 465,
//     //   secure: true,
//     //   auth: {
//     //     user: "pf.henry.2022@gmail.com",
//     //     pass: app_key,
//     //   },
//     // });

// //   const transporter = nodemailer.createTransport({
// //   host: 'smtp.gmail.com',
// //   port: 465,
// //   secure: true, // true for 465, false for other ports
// //   logger: true,
// //   debug: true,
// //   secureConnection: true,
// //   auth: {
// //       user: 'pf.henry.2022@gmail.com', 
// //       pass: app_key, 
// //   },
// //   tls:{
// //       rejectUnAuthorized: false
// //   }
// // })

// // Correo Saliente
// // Servidor: c1391753.ferozo.com
// // Certificado de seguridad SSL: Sí
// // SMTP Puerto: 465
// // hexatech@colaborativa.com.ar
// // 52PG*ME4gZ

// let transporter = nodemailer.createTransport({
//   host: "c1391753.ferozo.com",
//   port: 25,
//   logger: true,
//   debug: true,
//   secure: false,
//   auth: {
//     user: "hexatech@colaborativa.com.ar",
//     pass: '52PG*ME4gZ'
//   },
// });

// // let transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     type: "OAuth2",
// //     user: "pf.henry.2022@gmail.com",
// //     // accessToken: "ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x",
// //     accessToken: app_key
// //   },
// // });

//     // const transporter = nodemailer.createTransport('smtps://pf.henry.2022@gmail.com:yqqnsrytsdgzrhjc@smtp.gmail.com');

//     transporter.verify(() => {
//       console.log("Ready to send message");
//     });

//     transporter.sendMail(
//       {
//         from: "hexatech@colaborativa.com.ar",
//         to: 'hexatech@colaborativa.com.ar',
//         subject: "Sending Email using Node.js",
//         text: "That was easy!",
//       }
//     )
//     .then((info)=>{
//       console.log('info: ', info);
//     })
//     .catch((error)=>{
//       console.log(error);
//     })
    
//   } catch (error) {
//     return new Error(error.message)
//   }
// }


// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
const API_KEY = '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'
const sgMail = require('@sendgrid/mail')
// const template = require ('./template.html')

sgMail.setApiKey(API_KEY)


async function sendEmail(email, subject){
  // console.log('template', template)
  const msg = {
    to: email, // Change to your recipient
    from: 'pf.henry.2022@gmail.com', // Change to your verified sender
    subject: subject,
    text: 'and easy to do anywhere, even with Node.js',
    html: `
    <div>
      <p>
        Welcome to Hexatech Store 
      </p>

    </div>`
  }
  // sgMail.send(msg).then(() => {
  //   return 'Send email'
  // })
  // .catch((error) => {
  //   return error
  // })
  const response = await sgMail.send(msg).then(()=> {
    return {msg: 'Send email'}
  } ).catch((error) => {
    return {error: 'Error sending email'}
  })
  return response
}


module.exports = sendEmail;
