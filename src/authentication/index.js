const passport = require('passport');
const localStrategy = require('./strategies/local');
const jwtStrategy = require('./strategies/jwt');

passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);