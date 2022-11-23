//import jwt from 'jsonwebtoken';
const SECRET='9f3d23a61ad6e526f7c70761720a59fb'
const TEMPO='14400000'
const jwt = require('jsonwebtoken');

const secret = `${SECRET}`;
const timer = `${TEMPO}`;
module.exports = { sign() {payload => jwt.sign(payload, secret, {expiresIn: timer})},
 decode() {token => jwt.verify(token, secret)}}
