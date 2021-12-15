const express = require('express');
const app = express();

const player = require('./player');
app.get('/player', player['get']);

module.exports = {
    path: 'api',
    handler: app
}