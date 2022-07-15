const { Router } = require('express');
const router = Router();
const serviceConfigDb = require('../services/ConfigDb');
const service = new serviceConfigDb();



router.get('/', async (req, res) => {
    
    const response = await service.getAlterColumn();
    res.status(200).json({ message: response });
});


module.exports = router;