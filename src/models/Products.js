const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('products', {
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: {
                args: true,
                msg: 'Product name already exists'
            }
        },
        description: { //prospecto comercial
            type: DataTypes.TEXT,
            allowNull: false
        },
        technical_especification: { //caracyerísticas tecnicas del producto
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            validate: {
                min: 1,
            },
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            },
            defaultValue: 0,
        }
    });
};