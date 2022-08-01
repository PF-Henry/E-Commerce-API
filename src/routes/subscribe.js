const sendEmail = require('../utils/email/index.js')
const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
  try{
    const email = 'elec@ail.com';
    const subject = 'hexatech'
    const response = await sendEmail(email, subject)
    console.log(response)
    res.json(response)
  }catch (error) {
    res.json(error)
  }

})

module.exports = router;