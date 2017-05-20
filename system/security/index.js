import jwt from 'jsonwebtoken';

export function decrypt (token) {
    return jwt.verify(token, process.env.SECRET);
};

export function encrypt (data) {
    return jwt.sign(data, process.env.SECRET);
};