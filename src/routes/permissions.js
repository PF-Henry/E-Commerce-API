const { Router } = require('express');
const router = Router();
const servicePermissions = require('../services/Permissions.js');
const service = new servicePermissions();
const returnErrorMessage = require("../utils/msgErrors.js");
// const { Products } = require('../db.js');


router.get('/', async(req, res, next) => {
    try {
            const response = await service.getAll();
            return res.status(200).json(response);    
    } catch (error) {
        return returnErrorMessage(error);
    }
});

router.get('/:role', async(req, res, next) => {
    const {role} = req.params;
    try {
            const response = await service.getByRol(role);
            return res.status(200).json(response);    
    } catch (error) {
        return returnErrorMessage(error);
    }
});

router.get('/:id', async(req, res, next) => {
    let { id } = req.params;
    try {
        const response = await service.getById(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    let body = req.body;
    try {
            const response = await service.create(body);
            return res.status(201).json(response);
              
    } catch (error) {
        return returnErrorMessage(error);
    }
})

router.put('/:id', async(req, res, next) => {
    let { id } = req.params;
    let body = req.body;
    try {
            const response = await service.update(id, body);
            res.status(200).json(response);        
    } catch (error) {
        return returnErrorMessage(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    let { id } = req.params;
    try {
            const response = await service.delete(id);
            res.status(200).json(response);        
    } catch (error) {
        return returnErrorMessage(error);
    }
})

module.exports = router;