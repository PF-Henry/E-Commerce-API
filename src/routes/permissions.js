const { Router } = require('express');
const router = Router();
const serviceProducts = require('../services/Permissions.js');
const service = new serviceProducts();
const returnErrorMessage = require("../utils/msgErrors.js");
// const { Products } = require('../db.js');


router.get('/:rol', async(req, res, next) => {
    const { rol } = req.params;
    try {
        if(rol === "Admin" || rol === "Guest" || rol === "User"){
            const response = await service.getAll(rol);
            return res.status(200).json(response);
        }
       else{
        throw "Invalid Rol"
    }        
    } catch (error) {
        return returnErrorMessage(error);
    }
});

// router.get('/:id', async(req, res, next) => {
//     let { id } = req.params;
//     try {
//         const response = await service.getById(id);
//         res.status(200).json(response);
//     } catch (error) {
//         next(error);
//     }
// });

router.post('/rol', async(req, res, next) => {
    let body = req.body;
    try {
        if(rol === "Admin" || rol === "Guest" || rol === "User"){
            const response = await service.create(body);
            return res.status(201).json(response);
        }
        else{
            throw "Invalid Rol"
        }        
    } catch (error) {
        return returnErrorMessage(error);
    }
})

router.put('/:rol', async(req, res, next) => {
    let { rol } = req.params;
    let body = req.body;
    try {
        if(rol === "Admin" || rol === "Guest" || rol === "User"){
            const response = await service.update(rol, body);
            res.status(200).json(response);
        }
        else{
            throw "Invalid Rol"
        }
        
    } catch (error) {
        return returnErrorMessage(error);
    }
})

router.delete('/:rol', async(req, res, next) => {
    let { rol } = req.params;

    try {
        if(rol === "Admin" || rol === "Guest" || rol === "User"){
            const response = await service.delete(rol);
            res.status(200).json(response);
        }
        else{
            throw "Invalid Rol"
        }
        
    } catch (error) {
        return returnErrorMessage(error);
    }
})

module.exports = router;