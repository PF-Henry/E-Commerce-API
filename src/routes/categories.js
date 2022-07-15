const { Router } = require('express');
const { session } = require('passport');
const passport = require('passport');
const jwtStrategy = require('../authentication/strategies/jwt.js');
const router = Router();
const serviceCategories = require('../services/Categories.js');
const service = new serviceCategories();



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

router.post('/',
    passport.authenticate('jwt', { session: false }),
    async(req, res, next) => {

        try {
            const response = await service.create(req.body);
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    })

router.put('/:id', async(req, res, next) => {
    let { id } = req.params;
    let body = req.body;
    try {
        let response = await service.update(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    let { id } = req.params;
    try {
        let response = await service.delete(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

module.exports = router;