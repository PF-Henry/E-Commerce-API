const { Router } = require('express');
const router = Router();
const serviceProducts = require('../services/Products.js');
const service = new serviceProducts();

// const { Products } = require('../db.js');


router.get('/', async(req, res, next) => {
    const { name, category } = req.query;
    try {
        const response = await service.getAll(name, category);
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
    let { id } = req.params;
    let body = req.body;
    try {
        const response = await service.update(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    let { id } = req.params;

    try {
        const response = await service.delete(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

module.exports = router;