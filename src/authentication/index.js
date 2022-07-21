const passport = require('passport');
const localStrategy = require('./strategies/local');
const { googleStrategySignUp, googleStrategySignIn } = require('./strategies/google')
const jwtStrategy = require('./strategies/jwt');

passport.use('local', localStrategy); // Authenticate using local strategy
passport.use('googleSignUp', googleStrategySignUp); // Authenticate using google Strategy SignUp
passport.use('googleSignIn', googleStrategySignIn); // Authenticate using google Strategy SignIn
passport.use('jwt', jwtStrategy); // Autorization using jwt strategy