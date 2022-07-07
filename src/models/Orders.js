const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('orders', {
        sell_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            default: DataTypes.NOW
        },
        sell_time:{
            type: DataTypes.TIME,
            allowNull: false,
            default: DataTypes.NOW
        },
        total_sell:{
            type: DataTypes.FLOAT,
            validate:{
                min: 0
            },
            allowNull: false
        },
        state:{
            type: DataTypes.ENUM('created', 'processing', 'cancelled', 'complete'),
            allowNull: false
        }
    });
};