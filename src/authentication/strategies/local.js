const { Strategy } = require('passport-local');
const serviceUsers = require('../../services/User');
const service = new serviceUsers();
const { comparePassword } = require('../../utils/hashing');

const localStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, async(email, password, done) => {
    try {
        const user = await service.getByEmail(email);
        if (!user) {
            return done({ error: 'Invalid email' }, false);
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            done({ error: 'Invalid password' }, false);
        }

        if(!user.dataValues.state){
            return done({ error: 'Your account is inactiv' }, false);
        }

        delete user.dataValues.password;

        return done(null, user);
    } catch (error) {
        done(error, false);
    }
});

module.exports = localStrategy;