const jwt = require('jsonwebtoken');

const secret = 'fiu-fiu';
const expiresIn = '10s';
const algorithm = 'HS256';

// const payload = {
//     sub: '1234567890',
//     name: 'John Doe',
//     admin: true
// };

jwt.sign(user, secret, { expiresIn, algorithm }, (err, token) => {
    return token;
});

module.exports = jwt;