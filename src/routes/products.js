const { Router } = require('express');
const router = Router();

const { Products } = requiere('../db.js');


router.get('/', async(req, res, next) => {
    try {
        const products = await Products.findAll();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const product = await Products.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.id);
        await product.update(req.body);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const product = await Products.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
})