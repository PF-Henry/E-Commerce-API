'use strict';

const { Brands } = require("../db.js");

class serviceBrands {
    constructor() {
        this.brands = [];
    }

    async getAll() {
        try {
            return await Brands.findAll({
            });
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        return await Brands.findByPk(id);
    }


    async create(brand) {
        const { name, image } = brand;
        try {
            if (!name || !image) {
                throw 'Name or Image is requerid field.';
            }

            const regBrand = { name, image };

            const newBrand = await Brands.create(regBrand);

            return newBrand//{ msg: 'The brand was created successfully' };

        } catch (error) {
            return error;
        }
    }

    async update(id, name, image) {
        try{
            //console.log(id + " " + name + " " + image)
            if(!name && !image){
                return { msg: 'Not found name and image' };
            }
            if(!name){
                return await Brands.update(
                    {
                        image: image,
                    },{
                    where: {
                        id: id,
                    }  
                }       
                )        
            }
            if(!image){
                return await Brands.update(
                    {
                        name: name,
                    },{
                    where: {
                        id: id,
                    }  
                }       
                )        
            }
            return await Brands.update(
            {
                name: name,
                image: image
            },{
            where: {
                id: id,
            }  
        }       
            )
        } catch(error){
            return error
        }
    }

    async delete(id) {
        //console.log(id  + " el id es este")
        return await Brands.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = serviceBrands;