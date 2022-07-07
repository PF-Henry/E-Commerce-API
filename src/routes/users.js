const { Router } = require('express');
const router = Router();

const { Users } = requiere('../db.js');


router.get('/', async(req, res, next) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const users = await Users.create(req.body);
        res.status(201).json(users);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.id);
        await user.update(req.body);
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