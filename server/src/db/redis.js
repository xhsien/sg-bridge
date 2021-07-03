const redis = require("redis");
const config = require("@/config");
const { promisify } = require('util');
const serializer = require("./serializer");

const client = redis.createClient(config.REDIS_URL);

const getAsync = promisify(client.get).bind(client);

const assets = {
    gameForRoom: {
        genKey: (roomNumber) => `ROOM-GAME-${roomNumber}`, //prevent other assets e.g. user having same id as room
        ttl: 30 * 60,
    }
}

const REDIS_EXPIRE_SECS_COMMAND = 'EX';

const setGameForRoom = (roomNumber, room) => client.set(assets.gameForRoom.genKey(roomNumber), serializer.serialize(room), REDIS_EXPIRE_SECS_COMMAND, assets.gameForRoom.ttl, () => {console.log(`saved game for room ${roomNumber}`)});
const getGameForRoom = async (roomNumber) => serializer.deserializeToGame(await getAsync(assets.gameForRoom.genKey(roomNumber)));

module.exports  = {
    setGameForRoom: setGameForRoom,
    getGameForRoom: getGameForRoom,
}