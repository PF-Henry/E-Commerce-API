const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "http://localhost:3000";

const { signToken, verifyToken } = require("../utils/jwt");


router.get("/login/failed", (req, res) => {
    console.log('failed')
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

router.get("/logout", (req, res) => {
    // req.logout(function(err) {
    //     if (err) { return next(err); }
    //     res.redirect(CLIENT_URL);
    // });
    console.log('1', req.user)
    req.user = null;
    console.log('2', req.user)
    res.redirect(CLIENT_URL);
});

//router.get("/google", passport.authenticate("google", { scope: ["profile"] }));


router.get("/google", passport.authenticate("google", {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

router.get(
    "/google/callback",

    passport.authenticate("google", {
        session: false,
        // successRedirect: 'http://localhost:3000',
        // failureRedirect: 'http://localhost:3001/api/auth/login/failed'
    }),
    (req, res, next) => {
        const token = signToken(req.user);
        console.log('user', req.user)
            // next(req.user)
        res.cookie("token", token, { httpOnly: true, secure: true });
        res.redirect('http://localhost:3001/api/auth/login/success');
        // res.redirect(CLIENT_URL);
        // next(res);
    }
);

router.get("/login/success",

    (req, res) => {
        const token = req.cookies.token;
        // const user = req.user;
        res.json({ cookie: token })
            // res.json({ user: user })
            // res.redirect(CLIENT_URL);
            // const { user } = req;
            // console.log('user', user)
            // const token = signToken(user);
            // const payload = verifyToken(token);
            // // res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/`);
            // res.json({ token: payload });
            // res.json('hola');
    }
)

module.exports = router;