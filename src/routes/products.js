const { Router } = require('express');
const router = Router();
const serviceProducts = require('../services/Products.js');
const service = new serviceProducts();

// const { Products } = require('../db.js');


router.get('/', async(req, res, next) => {
    try {
        const allProducts = await service.getAll();
        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        const productById = await service.getById(req.params.id);
        res.status(200).json(productById);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const productCreated = await service.create(req.body);
        res.status(201).json(productCreated);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const product = await service.findByPk(req.params.id);
        await product.update(req.body);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const product = await service.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
})

module.exports = router;