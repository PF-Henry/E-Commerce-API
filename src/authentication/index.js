const passport = require('passport');
const localStrategy = require('./strategies/local');

passport.use('local', localStrategy);
// passport.use('jwt', jwtStrategy);