const sendEmail = require('../utils/email/index.js')
const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
  const { email } = req.body;
  const subject = 'Hexatech - Notifications - Reset Password';
  const template = 'forgotPassword';
  try{
    const response = await sendEmail(email, subject, template);
    res.json(response);
  }catch (error) {
    res.json(error);
  }

})

module.exports = router;