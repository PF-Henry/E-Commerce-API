const router = require("express").Router();
const passport = require("passport");
const { sendEmail } = require('../utils/email/index.js')

const CLIENT_URL = process.env.CLIENT_URL; 
const API_URL = process.env.API_URL;


//const CLIENT_URL = "http://localhost:3000";
// const API_URL = "http://localhost:3001";

const { signToken } = require("../utils/jwt");

let cookie = {};

//* Route for Google SignUp
router.get("/google/callback",
    passport.authenticate("googleSignUp", {
        session: false,
        failureRedirect: `${API_URL}/api/auth/register/failed`,
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/plus.login'
        ]
    }),
    async (req, res, next) => {
        if (req.user) {
            const {first_name, email} = req.user;
            const template = 'newUser';
            const data = undefined;
            const response = await sendEmail(email, first_name, data, template);
            //*
            const message = { msg: 'Successfully registered user - Login now' };
            res.cookie('message', message, { sameSite: 'none', secure: true });
            return res.redirect(`${API_URL}/api/auth/register`);
        }
    }
);


//* Route for Google SignIn
router.get("/google/signin",
    passport.authenticate("googleSignIn", {
        session: false,
        failureRedirect: `${API_URL}/api/auth/login/failed`,
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/plus.login'
        ]
    }),
    (req, res, next) => {
        if (req.user) {
            console.log('user', req.user.state)
            if(req.user.state === false){
                const message = { error: 'Your account has been deactivated - Contact support pf.henry.2022@gmail.com' };
                res.cookie('loginError', message, { sameSite: 'none', secure: true });
                return res.redirect(`${API_URL}/api/auth/register`);
            }
            const token = { token: signToken(req.user) }
            res.cookie('token', token, { sameSite: 'none', secure: true, httpOnly: false });
            return res.redirect(`${API_URL}/api/auth/login`);
        }
    }
);

router.get("/login/failed", (req, res, next) => {
    let message = { error: 'Access denied - First register' };
    res.cookie('loginError', message, { sameSite: 'none', secure: true });
    return res.redirect(`${API_URL}/api/auth/register`);
});

router.get("/login", (req, res) => {
    if (req.headers.origin !== CLIENT_URL) {
        if (req.cookies.registerError) {
            cookie = req.cookies.registerError;
            res.clearCookie('registerError');
            return res.redirect(`${CLIENT_URL}/auth/login`);
        }
        if (req.cookies.loginError) {
            cookie = req.cookies.loginError;
            res.clearCookie('loginError');
            return res.redirect(`${CLIENT_URL}/auth/register`);
        }
        if (req.cookies.token) {
            cookie = req.cookies.token;
            res.clearCookie('token');
            return res.redirect(302, CLIENT_URL);
        }
    }

    if (req.headers.origin === CLIENT_URL) {
        setTimeout(() => {
            cookie = {};
        }, 5000);
        return res.json(cookie);
    }
});

router.get("/register/failed", (req, res, next) => {
    let message = { error: 'User already exists - Login now' };
    res.cookie('registerError', message, { sameSite: 'none', secure: true });
    return res.redirect(`${API_URL}/api/auth/login`);
});

router.get("/register", (req, res) => {
    if (req.headers.origin !== CLIENT_URL) {
        if (req.cookies.loginError) {
            cookie = req.cookies.loginError;
            res.clearCookie('loginError');
            return res.redirect(`${CLIENT_URL}/auth/register`);
        }
        if (req.cookies.registerError) {
            cookie = req.cookies.registerError;
            res.clearCookie('registerError');
            return res.redirect(`${CLIENT_URL}/auth/login`);
        }
        if (req.cookies.message) {
            cookie = req.cookies.message;
            res.clearCookie('message');
            return res.redirect(`${CLIENT_URL}/auth/login`);
        }
    }
    if (req.headers.origin === CLIENT_URL) {
        setTimeout(() => {
            cookie = {};
        }, 5000);
        return res.json(cookie);
    }
});

router.get("/logout", (req, res, next) => {
    cookie = {};
    return res.json(cookie);
});


module.exports = router;
