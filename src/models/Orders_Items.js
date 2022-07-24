const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('orders_items', {
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        precio_venta:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        productId:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};