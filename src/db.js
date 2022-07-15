require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_NAME,
} = process.env;

let sequelize;

const {
    DATABASE_URL
} = process.env;

if (DATABASE_URL) {
    sequelize = new Sequelize(`${DATABASE_URL}`, {
        logging: false, // set to console.log to see the raw SQL queries
        native: false, // lets Sequelize know we can use pg-native for ~30% more speed
        //* Actualizar configuración de sequelize para SSL
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
} else {
    sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
        logging: false, // set to console.log to see the raw SQL queries
        native: false, // lets Sequelize know we can use pg-native for ~30% more speed
        //* Actualizar configuración de sequelize para SSL
    });
}

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, '/models', file)));
    });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Products, Categories, Images, Orders, Reviews, Users, Brands, Roles, Permissions } = sequelize.models;

// Aca vendrian las relaciones
Products.belongsToMany(Categories, { through: 'Products_Categories' });
Categories.belongsToMany(Products, { through: 'Products_Categories' });

Products.hasMany(Images);
Images.belongsTo(Products);

Products.hasMany(Reviews);
Reviews.belongsTo(Products);

Users.hasMany(Orders);
Orders.belongsTo(Users);

Orders.belongsToMany(Products, { through: 'Orders_Products' });
Products.belongsToMany(Orders, { through: 'Orders_Products' });

Users.belongsToMany(Products, { through: 'Users_Products' }); //** Favorites */
Products.belongsToMany(Users, { through: 'Users_Products' });

Brands.hasMany(Products); // brands has many products
Products.belongsTo(Brands); // Product belongs to brand

Roles.hasMany(Users);
Users.belongsTo(Roles);

Roles.hasMany(Permissions);
Permissions.belongsTo(Roles);

module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};