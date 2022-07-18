const passport = require('passport');
const localStrategy = require('./strategies/local');
const googleStrategy = require('./strategies/google')
const jwtStrategy = require('./strategies/jwt');

passport.use('local', localStrategy); // Authenticate using local strategy
passport.use('google', googleStrategy); // Authenticate using google strategy
passport.use('jwt', jwtStrategy); // Autorization using jwt strategy