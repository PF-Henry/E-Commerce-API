'use strict';

const { Router } = require('express');
const router = Router();
const { sendEmail, generatePassword } = require('../utils/email/index.js');
const serviceUser = require('../services/User.js');
const service = new serviceUser();

router.post('/', async (req, res) => {
  const { email } = req.body;
  const template = 'resetPassword';
  try{
    const userByEmail = await service.getByEmail(email);
    console.log('user', userByEmail);
    const user = userByEmail.first_name;
    const data = generatePassword(user);
    const response = await sendEmail(email, user, data, template);
    res.status(201).json(response);
  }catch (error) {
    res.json(error);
  }

})

module.exports = router;