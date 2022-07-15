const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;


const passport = require("passport");

const GOOGLE_CLIENT_ID = "235979960971-7r767q69dqo9hasdrb416r4sfhb8rmjj.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const GITHUB_CLIENT_ID = "your id";
const GITHUB_CLIENT_SECRET = "your id";

const FACEBOOK_APP_ID = "your id";
const FACEBOOK_APP_SECRET = "your id";

passport.use(
    new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        function(accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);

passport.use(
    new GithubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/callback",
        },
        function(accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);


passport.use(
    new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: "/auth/facebook/callback",
        },
        function(accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


// module.exports = {

// }