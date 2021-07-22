import _ from 'lodash';
import socket from './socket/index.js';

module.exports = class EventRouter {
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

    registerOnConnectListener(callBackFn) {
        this.registerListener("connect", callBackFn);
    }

    registerOnRoomUpdateListener(callBackFn) {
        this.registerListener('room update', callBackFn);
    }

    registerOnGameStartedListener(callBackFn) {
        this.registerListener("game started", callBackFn);
    }

    registerOnGameSetListener(callBackFn) {
        this.registerListener("game set", callBackFn);
    }

    registerOnCardPlayedListener(callBackFn) {
        this.registerListener("card played", callBackFn);
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