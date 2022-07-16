const { Router } = require('express');
const router = Router();

const serviceUser = require('../services/User');
const service = new serviceUser();

const passport = require('passport');
const { signToken, verifyToken } = require('../utils/jwt');
// const jwt = require('jsonwebtoken');


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
        console.log('user', user);
        // const payload = {
        //     ...user
        // };
        const payload = user;
        console.log(payload);
        // const secret = 'secretKey';

        try {
            const token = signToken(payload);
            const payloadResponse = verifyToken(token);
            // res.json({
            //     user,
            //     token
            // });
            res.json(payloadResponse);
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
    const { id } = req.params;
    try {
        const response = await service.delete(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

module.exports = router;