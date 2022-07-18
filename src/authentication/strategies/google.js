const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const serviceUser = require("../../services/user");
const service = new serviceUser();



const GOOGLE_CLIENT_ID = "559232330287-ctdb2lf5f65n3mmiu1pas5gie6oa3ljo.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const googleStrategy = new Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/api/auth/google/callback",
        passReqToCallback: true
    },
    async function(req, accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function(err, user) {
        //     return done(err, user);
        // });
        const userByEmail = await service.getByEmail(profile.emails[0].value);
        if (!userByEmail) {
            const newUser = {
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.emails[0].value,
                password: "",
            }
            const userCreated = await service.create(newUser);
            done(null, userCreated);
        }
        done(null, userByEmail);
    });

module.exports = googleStrategy;