const { Router } = require('express');
const router = Router();

const { Orders } = requiere('../db.js');


router.get('/', async(req, res, next) => {
    try {
        const orders = await Orders.findAll();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    try {
        const order = await Orders.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const order = await Orders.findByPk(req.params.id);
        await order.update(req.body);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const order = await Orders.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
})