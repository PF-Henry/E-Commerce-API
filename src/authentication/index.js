const passport = require('passport');
const localStrategy = require('./strategies/local');
const jwtStrategy = require('./strategies/jwt');

passport.use('local', localStrategy); // Authenticate using local strategy
passport.use('jwt', jwtStrategy); // Autorization using jwt strategy