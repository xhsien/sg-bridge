import _ from 'lodash';
import socket from './socket/index.js';

class EventRouter {
    constructor() {
        this.socket = socket;
        this.listenersMap = new Map();

        this.eventsToListen = ["connect", "room update", "game started", "game set", "card played"];

        for (const e of this.eventsToListen) {
            socket.on(e, (data) => {
                if (this.listenersMap.has(e)) {
                    for (const listener of this.listenersMap.get(e)) {
                        listener.fn(data);
                    }
                }
            })
        }
    }

    registerListener(eventName, id, callBackFn) {
        if (this.listenersMap.has(eventName)) {
            this.listenersMap.get(eventName).push({id: id, fn: callBackFn});
        } else {
            this.listenersMap.set(eventName, [{id: id, fn: callBackFn}]);
        }
    }

    removeAllListeners(id) {
        this.listenersMap.forEach((value, key, map) => {
            _.remove(map.get(value), (listener) => listener.id === id )
        })
    }

    connect(username) {
        socket.auth = {username: username};
        socket.connect();
    }

    getSocketId() {
        return this.socket.id;
    }

    registerOnConnectListener(id, callBackFn) {
        this.registerListener("connect", id, callBackFn);
    }

    registerOnRoomUpdateListener(id, callBackFn) {
        this.registerListener('room update', id, callBackFn);
    }

    registerOnGameStartedListener(id, callBackFn) {
        this.registerListener("game started", id, callBackFn);
    }

    registerOnGameSetListener(id, callBackFn) {
        this.registerListener("game set", id, callBackFn);
    }

    registerOnCardPlayedListener(id, callBackFn) {
        this.registerListener("card played", id, callBackFn);
    }

    emitJoinRoom(roomNumber, callback) {
        this.socket.emit("join room", roomNumber, callback);
    }

    emitStartGame(roomNumber, callback) {
        this.socket.emit("start game", roomNumber, callback);
    }

    emitSetupGame(roomNumber, selectedTrump, selectedFirstPlayerId, callback) {
        this.socket.emit("setup game", roomNumber, selectedTrump, selectedFirstPlayerId, callback);
    }

    emitPlayCard(roomNumber, id, card, callback) {
        this.socket.emit("play card", roomNumber, id, card, callback);
    }

    emitNewRoom(callback) {
        this.socket.emit("new room", callback);
    }
}

export default EventRouter