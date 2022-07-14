const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('permissions', {
        entity: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false,
        },
        get:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        post:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        delete:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        put:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });
};