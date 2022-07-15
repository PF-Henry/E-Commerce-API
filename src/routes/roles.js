const { Router } = require('express');
const router = Router();
const serviceRoles = require('../services/Roles');
const service = new serviceRoles();


router.get('/', async(req, res, next) => {
    try {
        const response = await service.getAll();
        res.status(200).json(response);
    } catch (error) {
        next(error);
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
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const { name, image } = req.body;
        const { id } = req.params
        const response = await service.update(id, name);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})


router.delete('/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const response = await service.delete(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})



module.exports = router;