const redis = require("./redis");

module.exports = {
    db: redis,
    setGameForRoom: redis.setGameForRoom,
    getGameForRoom: redis.getGameForRoom,
    setPlayersForRoom: redis.setPlayersForRoom,
    getPlayersForRoom: redis.getPlayersForRoom,
    roomExists: redis.roomExists,
}