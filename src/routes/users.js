const { Router } = require('express');
const router = Router();

const { sendEmail } = require('../utils/email/index.js')

const serviceUser = require('../services/User');
const service = new serviceUser();

const passport = require('passport');
const { signToken, verifyToken } = require('../utils/jwt');
// const jwt = require('jsonwebtoken');


router.get('/', async(req, res, next) => {
    const name = req.query.name;
    try {
        const response = await service.getAll(name);
        if(name){
            response.length ?
            res.status(200).send(response) :
            res.status(404).send({error:'This user does not exist'})
        } else {
            res.status(200).json(response);
        }     
    } catch (error) {
        next(error);
    }
});


router.post('/register', async(req, res, next) => {
    const body = req.body;
    const { first_name, email} = body;
    const template = 'newUser';
    const data = undefined;
    try {
       
        const response = await service.create(body);
        const emailSended = await sendEmail(email, first_name, data, template);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
})

router.post('/login',
    passport.authenticate('local', { session: false }),
    async(req, res, next) => {

    const { user } = req;

    const payload = user;

    try {
        const token = signToken(payload);
        res.json({
            token
        });
    } catch (error) {
        next(error);
    }
})


router.put('/user/:id', async(req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    console.log(body);
    try {
        const response = await service.updateProfileUser(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


router.put('/admin/:id', async(req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const response = await service.updateProfileAdmin(id, body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


router.put('/softDelete/:id', async(req, res, next) => {
    const id = req.params.id;
    const state = req.body.state;
    try {
        const response = await service.softDelete(id, state);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


router.put('/resetPassword/:id', async(req, res, next) => {
    const id = req.params.id;
    const state = req.body.state;
    try {
        const response = await service.resetPassword(id, state);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


router.put('/changeRole/:id', async(req, res, next) => {
    const id = req.params.id;
    const role = req.body.role;
    try {
        const response = await service.changeRole(id, role);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});




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