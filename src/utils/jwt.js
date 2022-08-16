const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;  
const EXPIRE_IN = process.env.EXPIRE_IN; 
const ALGORITHM = process.env.ALGORITHM; 

//* Returns a token with the payload and the secret
function signToken(payload, secret = SECRET_KEY) {
    return jwt.sign({ payload }, secret, { expiresIn: EXPIRE_IN, algorithm: ALGORITHM });
}

//* Returns the payload of the token
function verifyToken(token, secret = SECRET_KEY) {
    return jwt.verify(token, secret, { algorithm: ALGORITHM });
}

module.exports = {
    signToken,
    verifyToken
};
