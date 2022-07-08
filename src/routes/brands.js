const { Router } = require('express');
const router = Router();
const serviceBrands = require('../services/Brands');
const service = new serviceBrands();
//const { Brands, Products } = require('../db.js');



router.get('/', async(req, res, next) => {
    try {
        const allBrands = await service.getAll();
        res.status(200).json(allBrands);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        const brandById = await service.getById(req.params.id);
        res.status(200).json(brandById);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const brandCreated = await service.create(req.body);
        res.status(201).json(brandCreated);
    } catch (error) {
        next(error);
    }
})


router.put('/update/:id', async(req, res, next) => {
    try {
        const {name, image} = req.body;
        const {id} = req.params
        const brand = await service.update(id, name, image);
        res.status(200).json(brand);
    } catch (error) {
        next(error);
    }
})


router.delete('/delete/:id', async(req, res, next) => {
    try {
        const {id} = req.params;
        const brand = await service.delete(id);
        res.status(200).json(brand);
    } catch (error) {
        next(error);
    }
})



module.exports = router;