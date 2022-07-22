const router = require("express").Router();
const { request } = require("express");
const passport = require("passport");

const CLIENT_URL = "https://hexatech-store.netlify.app";
const API_URL = "https://hexatech-api.herokuapp.com";

// const CLIENT_URL = "http://localhost:3000";
// const API_URL = "http://localhost:3001";
const { signToken, verifyToken } = require("../utils/jwt");



router.get("/logout", (req, res, next) => {
    res.clearCookie('cookie');
    res.redirect(CLIENT_URL);
});


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
        let message = 'Registro exitoso - Ahora inicia session';
        res.append('Origin-Cookie', `error=${message}`);
        res.redirect(`${CLIENT_URL}/login`);
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
        const token = signToken(req.user);
        res.append('Origin-Cookie', `error=${message}`);
        res.redirect(CLIENT_URL);
    }
);

router.get("/register/failed", (req, res) => {
    let message = 'El usuario ya existe - Ahora inicia session';
    res.append('Origin-Cookie', `error=${message}`);
    res.redirect(`${CLIENT_URL}/login`);
});

router.get("/login/failed", (req, res) => {
    let message = 'Acceso denegado - Debes registrarte';
    res.append('Origin-Cookie', `error=${message}`);
    res.redirect(`${CLIENT_URL}/register`);
});


module.exports = router;