const player = require('../player');
module.exports = {
    get: (req, res) => {
        let option = {
            cuid: req.query.cuid,
            expt: req.query.expt,
            mck: req.query.mck
        };
        res.send({url: player.createPlayerUrl(option)});
    }
}