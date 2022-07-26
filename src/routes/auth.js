const router = require("express").Router();
const { request } = require("express");
const { session } = require("passport");
const passport = require("passport");

const CLIENT_URL = "https://hexatech-store.netlify.app";
const API_URL = "https://hexatech-api.herokuapp.com";

// const CLIENT_URL = "http://localhost:3000";
// const API_URL = "http://localhost:3001";
const { signToken, verifyToken } = require("../utils/jwt");

let cookie = {};

//* Route for Google SignUp
router.get("/google/callback",
    passport.authenticate("googleSignUp", {
        session: false,
        // failureRedirect: "http://localhost:3001/api/auth/register/failed",
        failureRedirect: `${API_URL}/api/auth/register/failed`,
        // successRedirect: "http://localhost:3001/api/auth/login/success",
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/plus.login'
        ]
    }),
    (req, res, next) => {
        if (req.user) {
            // let message = 'Registro exitoso - Ahora inicia session';
            let message = { msg: 'Registro exitoso - Ahora inicia session' };
            res.cookie('message', message, { sameSite: 'none', secure: true });
            res.redirect(`${API_URL}/api/auth/register`);
        }
    }
);


//* Route for Google SignIn
router.get("/google/signin",
    passport.authenticate("googleSignIn", {
        session: false,
        // failureRedirect: "http://localhost:3001/api/auth/login/failed",
        failureRedirect: `${API_URL}/api/auth/login/failed`,
        // successRedirect: "http://localhost:3001/api/auth/login/success",
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/plus.login'
        ]
    }),
    (req, res, next) => {
        if (req.user) {
            console.log('user', req.user);
            // const token = signToken(req.user);
            const token = { token: signToken(req.user) }
            res.cookie('token', token, { sameSite: 'none', secure: true, httpOnly: false });
            res.redirect(`${API_URL}/api/auth/login`);
        }
    }
);

router.get("/login/failed", (req, res, next) => {
    // let message = 'Acceso denegado - Debes registrarte';
    let message = { error: 'Acceso denegado - Debes registrarte' };
    res.cookie('loginError', message, { sameSite: 'none', secure: true });
    res.redirect(`${API_URL}/api/auth/register`);
});

router.get("/login", (req, res) => {
    if (req.headers.origin !== CLIENT_URL) {
        if (req.cookies.registerError) {
            cookie = req.cookies.registerError;
            res.clearCookie('registerError');
            return res.redirect(`${CLIENT_URL}/login`);
        }
        if (req.cookies.loginError) {
            cookie = req.cookies.loginError;
            res.clearCookie('loginError');
            return res.redirect(`${CLIENT_URL}/register`);
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
    // let message = 'El usuario ya existe - Inicia sesion';
    let message = { error: 'El usuario ya existe - Inicia sesion' };
    res.cookie('registerError', message, { sameSite: 'none', secure: true });
    res.redirect(`${API_URL}/api/auth/login`);
});

router.get("/register", (req, res) => {
    if (req.headers.origin !== CLIENT_URL) {
        if (req.cookies.loginError) {
            cookie = req.cookies.loginError;
            res.clearCookie('loginError');
            return res.redirect(`${CLIENT_URL}/register`);
        }
        if (req.cookies.registerError) {
            cookie = req.cookies.registerError;
            res.clearCookie('registerError');
            return res.redirect(`${CLIENT_URL}/login`);
        }
        if (req.cookies.message) {
            cookie = req.cookies.message;
            res.clearCookie('message');
            return res.redirect(`${CLIENT_URL}/login`);
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
    cookie = {}; // Clear the cookie
    // return res.redirect(302, CLIENT_URL);
    return res.json(cookie);
});


module.exports = router;