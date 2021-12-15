const jsonwebtoken = require('jsonwebtoken');
const config = require('../config');
module.exports = {
    create: (payload) => {
        return jsonwebtoken.sign(payload, config.kollus.secretkey, config['jwt_options']);
    }
}