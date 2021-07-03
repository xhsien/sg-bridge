const redis = require("redis");
const config = require("@/config");
const { promisify } = require('util');
const serializer = require("./serializer");

const client = redis.createClient(config.REDIS_URL);

const getAsync = promisify(client.get).bind(client);

const assets = {
    gameForRoom: {
        genKey: (roomNumber) => `ROOM-GAME-${roomNumber}`, //prevent other assets e.g. user having same id as room
        ttl: 30 * 60, //secs
    },
    roomToPlayers: {
        genKey: (roomNumber) => `ROOM-TO-PLAYERS-${roomNumber}`, //prevent other assets e.g. user having same id as room
        ttl: 30 * 60, //secs
    }
}

const REDIS_EXPIRE_SECS_COMMAND = 'EX';

const setGameForRoom = (roomNumber, game) => client.set(assets.gameForRoom.genKey(roomNumber), serializer.serialize(game), REDIS_EXPIRE_SECS_COMMAND, assets.gameForRoom.ttl, () => {console.log(`saved game for room ${roomNumber}`)});
const getGameForRoom = async (roomNumber) => serializer.deserializeToGame(await getAsync(assets.gameForRoom.genKey(roomNumber)));

const setPlayersForRoom = (roomNumber, players) => {
    client.set(assets.roomToPlayers.genKey(roomNumber), serializer.serialize(players), REDIS_EXPIRE_SECS_COMMAND, assets.roomToPlayers.ttl, () => {console.log(`saved players to room ${roomNumber}`)});
}

const getPlayersForRoom = async (roomNumber) => serializer.deserialize(await getAsync(assets.roomToPlayers.genKey(roomNumber)));

const roomExists = async (roomNumber) => {
    return await getPlayersForRoom(roomNumber) != null;
}


module.exports  = {
    setGameForRoom: setGameForRoom,
    getGameForRoom: getGameForRoom,
    setPlayersForRoom: setPlayersForRoom,
    getPlayersForRoom: getPlayersForRoom,
    roomExists: roomExists,
}