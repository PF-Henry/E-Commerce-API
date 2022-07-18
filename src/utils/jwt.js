const jwt = require('jsonwebtoken');

const secret = 'secretKey';
const expiresIn = '20s';
const algorithm = 'HS256';

//* Returns a token with the payload and the secret
function signToken(payload, secret = 'secretKey') {
    return jwt.sign({ payload }, secret, { expiresIn, algorithm });
}

//* Returns the payload of the token
function verifyToken(token, secret = 'secretKey') {
    return jwt.verify(token, secret, { algorithm });
}

module.exports = {
    signToken,
    verifyToken
};