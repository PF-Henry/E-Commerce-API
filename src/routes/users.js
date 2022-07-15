const { Router } = require('express');
const router = Router();

const serviceUser = require('../services/User');
const service = new serviceUser();

const passport = require('passport');
// const jwt = require('../utils/jwt');
const jwt = require('jsonwebtoken');


router.get('/', async(req, res, next) => {
    try {
        const response = await service.getAll();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/register', async(req, res, next) => {
    const body = req.body;
    try {
        const response = await service.create(body);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
})

router.post('/login',
    passport.authenticate('local', { session: false }),

    async(req, res, next) => {

        const { user } = req;
        const secret = 'fiufiu';
        // const expiresIn = '10s';
        // const algorithm = 'HS256';

        try {
            // const token = jwt.sign({ user }, secret, { expiresIn, algorithm }, (err, token) => {
            jwt.sign({ user }, secret, (err, token) => {
                res.json({ token });
            });

            // res.json(user);
        } catch (error) {
            next(error);
        }
    })


router.put('/:id', async(req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const response = await service.findByPk(id);
        await service.update(body);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const user = await Users.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
})

module.exports = router;