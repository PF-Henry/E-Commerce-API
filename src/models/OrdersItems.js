const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('ordersItems', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unit_price:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        productId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        rating:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    });
};