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

// router.get('/', async(req, res, next) => {
//     const first_name = req.query.first_name
//     const last_name = req.query.last_name 
//     try {
//         const response = await service.getAll();
//         if(first_name || last_name){
//             let responseUserName =  await response.filter(e => e.first_name.toLowerCase()===(first_name.toLowerCase()))
//             let responseUserLastName = await response.filter(e => e.last_name.toLowerCase()===(last_name.toLowerCase()))
//             if(responseUserName.length){
//                 res.status(200).send(responseUserName)
//             } else if(responseUserLastName.length){
//                 res.status(200).send(responseUserLastName)
//             }
//             res.status(404).send('This user does not exist')
//         }
//         res.status(200).json(response);
//     } catch (error) {
//         next(error);
//     }
// });

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