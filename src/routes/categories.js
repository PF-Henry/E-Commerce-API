const { Router } = require('express');
const router = Router();

const { Categories } = require('../db.js');


router.get('/', async(req, res, next) => {
    try {
        const categories = await Categories.findAll();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const category = await Categories.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const category = await Categories.findByPk(req.params.id);
        await category.update(req.body);
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const category = await Categories.destroy({
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