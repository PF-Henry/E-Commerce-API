const { Router } = require('express');
const router = Router();
const { Brands, Products } = require('../db.js');



router.get('/', async(req, res, next) => {
    try {
        const brands = await Brands.findAll({
            include: Products
        });
        res.status(200).json(brands);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const brand = await Brands.create(req.body);
        res.status(201).json(brand);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const brand = await Brands.findByPk(req.params.id);
        await brand.update(req.body);
        res.status(200).json(brand);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const brand = await Brands.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(brand);
    } catch (error) {
        next(error);
    }
})

module.exports = router;