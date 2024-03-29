const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes/index.js');
//const passport = require('passport');


require('./db.js');

const server = express();
const session = require('express-session');
const { Cookie } = require('express-session');

const SECRET_KEY = process.env.SECRET_KEY;

server.name = 'API';



server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));

server.use(cors());
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Cambiar a URL de front-end en producción
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

require('./authentication/index.js');
server.set("trust proxy", 1);
server.use(
    session({
        secret: SECRET_KEY,
        resave: true,
        saveUninitialized: false,
        cookie: {
            path: '/',

            // sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
            sameSite: 'none',

            // secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
            secure: true,
            hhttpOnly: false,
        }
    })
);

// server.use(cookieSession({ name: 'session', keys: ['key1', 'key2'] }));


// server.use(passport.initialize());

server.use('/api', routes);

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    res.status(status).send(message);
});

module.exports = server;