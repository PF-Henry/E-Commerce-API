const sendEmail = require('../utils/email/index.js')
const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
  const email = 'electronsgm@gmail.com';
  const subject = 'hexatech';
  // const template = 'newSubscriber';
  const template = 'newOrder';
  try{
    const response = await sendEmail(email, subject, template);
    res.json(response);
  }catch (error) {
    res.json(error);
  }

})

module.exports = router;