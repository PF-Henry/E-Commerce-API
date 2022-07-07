const { Router } = require('express');
const router = Router();

const { Images } = requiere('../db.js');


router.get('/', async(req, res, next) => {
    try {
        const images = await Images.findAll();
        res.status(200).json(images);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const images = await Images.create(req.body);
        res.status(201).json(images);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const images = await Images.findByPk(req.params.id);
        await user.update(req.body);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const image = await Images.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(image);
    } catch (error) {
        next(error);
    }
})