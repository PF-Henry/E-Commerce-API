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
            done({ msg: 'Invalid email' }, false);
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            done({ msg: 'Invalid password' }, false);
        }
        delete user.dataValues.password;

        return done(null, user);
    } catch (error) {
        done(error, false);
    }
});

module.exports = localStrategy;