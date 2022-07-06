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
            type: DataTypes.DATE,
            allowNull: false,
            default: DataTypes.NOW
        },
        id_users:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_sell:{
            type: DataTypes.FLOAT,
            validate:{
                min: 0
            },
            allowNull: false
        },
        state:{
            type: DataTypes.ENUM('creada', 'procesando', 'cancelada', 'completa'),
            allowNull: false
        }
    });
};