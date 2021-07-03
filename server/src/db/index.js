const redis = require("./redis");

const createRoom = (roomNumber, room) => {
    redis.client
}

module.exports = {
    db: redis,
    setGameForRoom: redis.setGameForRoom,
    getGameForRoom: redis.getGameForRoom,
}