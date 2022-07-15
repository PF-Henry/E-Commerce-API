const jwt = require('jsonwebtoken');

const secret = 'secret';
const expiresIn = '1h';
const algorithm = 'HS256';
const payload = {
    sub: '1234567890',
    name: 'John Doe',
    admin: true
};