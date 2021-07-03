const Game = require("@/models/game")

module.exports = {
    serialize: (obj) => JSON.stringify(obj),
    deserializeToGame: (str) => {
        const raw = JSON.parse(str);
        const game = new Game(raw.playerIds, raw.playerUsernames);
        return Object.assign(game, raw);
    },
}