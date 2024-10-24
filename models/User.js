const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const player = new Schema({
    username: {
        type: 'string',
        required: true
    },

    password: {
        type: 'string',
        required: true
    },

    refreshToken: {
        type: 'string'
    },

    role: {
        type: 'string',
        default: 'guest',
        required: true
    }
});



module.exports = mongoose.model('player', player);