'use strict';

const { Router } = require('express');
const router = Router();
const { sendEmail, generatePassword } = require('../utils/email/index.js');
const serviceUser = require('../services/User.js');
const service = new serviceUser();

router.post('/', async (req, res, next) => {
  const { email } = req.body;
  const template = 'resetPassword';
  try{
    const userByEmail = await service.getByEmail(email);
    if(!userByEmail){
      return res.json({error: 'User not found'});
    }
    
    const userId = userByEmail.id;
    const user = userByEmail.first_name;
    const data = generatePassword(user);
    const passwordChanged = await service.changePassword(userId, data);
    const passwordReset = await service.resetPassword(userId, true);

    if(passwordChanged.msg === 'Update password successfully' && passwordReset.msg === 'Reset password successfully'){
      const response = await sendEmail(email, user, data, template);
      return res.status(201).json(response);
    }
  }catch (error) {
    next(error);
  }

})

module.exports = router;