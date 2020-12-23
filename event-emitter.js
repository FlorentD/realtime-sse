const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

console.log("here ? ", eventEmitter);

module.exports = eventEmitter;
