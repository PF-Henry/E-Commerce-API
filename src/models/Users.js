const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('users', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        mail:{
            type: DataTypes.STRING,
            validate:{
                isEmail: true,
            },
            allowNull: false,
            unique: true
        },
        password:{
            type: DataTypes.STRING(12),
            validate:{
                isAlphanumeric: true,
            },
            allowNull: false
        },
        id_rol:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        cellphone:{
            type: DataTypes.INTEGER,
            validate:{
                isNumeric: true, 
            },
            allowNull: false
        },
        location:{
            type: DataTypes.STRING,
            allowNull: false
        },
        department:{
            type: DataTypes.STRING,
            allowNull: false
        },
        zip_code:{
            type: DataTypes.STRING,
            allowNull: false
        },
        reset_password:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
};