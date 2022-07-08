const { Router } = require('express');
const router = Router();
const serviceCategories = require('../services/Categories.js');
const service = new serviceCategories();



router.get('/', async(req, res, next) => {
    try {
        const allCategories = await service.getAll();
        res.status(200).json(allCategories);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        const categoryById = await service.getById(req.params.id);
        res.status(200).json(categoryById);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {

    try {
        const categoryCreated = await service.create(req.body);
        res.status(201).json(categoryCreated);
    } catch (error) {
        next(error);
    }
})



router.put('/:id', async(req, res, next) => {
    try {
        const category = await service.findByPk(req.params.id);
        await category.update(req.body);
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const category = await service.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
})

module.exports = router;