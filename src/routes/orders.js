const { Router } = require('express');
const router = Router();

const serviceOrders = require('../services/Orders.js');
const service = new serviceOrders();


router.get('/', async(req, res, next) => {
    try {
        const response = await service.getAll();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


router.get('/user/:userId', async(req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await service.getOrdersByUser(userId);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
});



    
router.put('/updateState/:orderId', async(req, res, next) => {
    try {
        const { orderId } = req.params;
        const { state } = req.body;
        const response = await service.updateState(orderId, state);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})


// router.post('/', async(req, res, next) => {
//     try {
//         const order = await Orders.create(req.body);
//         res.status(201).json(order);
//     } catch (error) {
//         next(error);
//     }
// })

// router.put('/:id', async(req, res, next) => {
//     try {
//         const { orderId } = req.params;
//         const order = await Orders.findByPk(req.params.id);
//         await order.update(req.body);
//         res.status(200).json(order);
//     } catch (error) {
//         next(error);
//     }
// })

// router.delete('/:id', async(req, res, next) => {
//     try {
//         const order = await Orders.destroy({
//             where: {
//                 id: req.params.id
//             }
//         });
//         res.status(200).json(order);
//     } catch (error) {
//         next(error);
//     }
// })

module.exports = router;