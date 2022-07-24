const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const serviceUser = require("../../services/User");
const service = new serviceUser();

const GOOGLE_CLIENT_ID = "559232330287-ctdb2lf5f65n3mmiu1pas5gie6oa3ljo.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

//* Google Strategy for Signing Up
const googleStrategySignUp = new Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://hexatech-api.herokuapp.com/api/auth/google/callback',
        // callbackURL: "http://localhost:3001/api/auth/google/callback",
        passReqToCallback: true
    },
    async function(req, accessToken, refreshToken, profile, done) {
        try {
            const userByEmail = await service.getByEmail(profile.emails[0].value);
            if (userByEmail) {
                done(null, false); //* Erorr: User already exists
            } else {
                const newUser = {
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email: profile.emails[0].value,
                    password: "",
                }
                const userCreated = await service.create(newUser);
                done(null, userCreated);
            }
        } catch (error) {
            done(error, false);
        }

    });


//* Google Strategy for Signing In
const googleStrategySignIn = new Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        // callbackURL: "http://localhost:3001/api/auth/google/signin",
        callbackURL: "https://hexatech-api.herokuapp.com/api/auth/google/signin",
        passReqToCallback: true
    },
    async function(req, accessToken, refreshToken, profile, done) {
        const userByEmail = await service.getByEmail(profile.emails[0].value);
        if (!userByEmail) {
            done(null, false);
        } else {
            done(null, userByEmail);
        }
    });

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    user = service.getById(user.id);
    done(null, user);
});

module.exports = {
    googleStrategySignUp,
    googleStrategySignIn
};