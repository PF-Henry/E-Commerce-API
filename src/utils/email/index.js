const nodemailer = require("nodemailer");



// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   port:465,
//   secure: true, // true for 465, false for other ports
//   logger: true,
//   debug: true,
//   secureConnection: false,
//   auth: {
//       user: 'pf.henry.2022@gmail.com', 
//       pass: app_key, 
//   },
//   tls:{
//       rejectUnAuthorized: false
//   }
// })

                

// const transporter = nodemailer.createTransport('smtps://pf.henry.2022@gmail.com:yqqnsrytsdgzrhjc@smtp.gmail.com');

async function sendEmail() {
  try {

    const app_key = "yqqnsrytsdgzrhjc";

    // const transporter = nodemailer.createTransport({
    //   service: "smtps.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: "pf.henry.2022@gmail.com",
    //     pass: app_key,
    //   },
    // });

  const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port:587,
  secure: true, // true for 465, false for other ports
  logger: true,
  debug: true,
  secureConnection: true,
  auth: {
      user: 'pf.henry.2022@gmail.com', 
      pass: app_key, 
  },
  tls:{
      rejectUnAuthorized: false
  }
})

    // const transporter = nodemailer.createTransport('smtps://pf.henry.2022@gmail.com:yqqnsrytsdgzrhjc@smtp.gmail.com');

    transporter.verify(() => {
      console.log("Ready to send message");
    });

    transporter.sendMail(
      {
        from: "pf.henry.2022@gmail.com",
        to: 'electronsgm@gmail.com',
        subject: "Sending Email using Node.js",
        text: "That was easy!",
      }
    )
    .then((info)=>{
      console.log(info);
    })
    .catch((error)=>{
      console.log(error);
    })
    
  } catch (error) {
    return new Error(error.message)
  }
}

module.exports = sendEmail;
