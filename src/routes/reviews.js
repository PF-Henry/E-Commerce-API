const { Router } = require('express');
const router = Router();
const serviceReviews = require('../services/Reviews');
const services = new serviceReviews();


router.get('/', async(req, res, next) => {
    try {
        const reviews = await services.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const review = await services.create(req.body);
        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const review = await services.findByPk(req.params.id);
        await review.update(req.body);
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const review = await Reviews.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
})

module.exports = router;