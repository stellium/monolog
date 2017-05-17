"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@stellium/common");
var amqlib = require('amqplib/callback_api');
/**
 * config Object
 * {
 *     file_path: String;
 *     line_number: Number(__line);
 *     error: Mixed;
 *     message: String;
 *     severity: Enum('sever', 'moderate', 'light')
 * }
 */
/*
 export const MonologX = (config: MonologSchema, callback?: Function) => {

 return {

 createClient: () => {

 amqlib.connect(`amqp://${containerized() ? 'rabbit' : 'localhost'}`, (err, conn) => {

 })
 }
 }

 // Set default severity value
 config.severity = config.severity || 'severe'

 // Save to database in production
 MonologModel.create(config, (err, monologEntry) => {

 if (config.severity === 'severe') {
 // Send notification to all Stellium developers on severe
 // notification that requires immediate attention
 sendPushNotification(config.message, monologEntry._id)
 }

 // Trigger callback if provided
 if (callback && typeof callback === 'function') callback(err, monologEntry)
 })
 }
 */
var rabbitChannel;
amqlib.connect("amqp://" + common_1.DockerServiceAddress.RabbitMQ, function (err, conn) {
    if (err) {
        console.log('error connecting to rabbit server', err);
        return;
    }
    conn.createChannel(function (err, ch) {
        if (err) {
            console.log('error creating rabbit channel', err);
            return;
        }
        rabbitChannel = ch;
    });
});
var Monolog = (function () {
    function Monolog() {
    }
    Monolog.createClient = function () {
        return new Monolog;
    };
    Monolog.prototype.log = function (message) {
        if (!rabbitChannel) {
            throw new Error('The RabbitMQ Channel has not been initialised yet');
        }
        var q = 'monolog';
        rabbitChannel.assertQueue(q, { durable: false });
        rabbitChannel.sendToQueue(q, Buffer.from(JSON.stringify(message)));
    };
    return Monolog;
}());
exports.Monolog = Monolog;
//# sourceMappingURL=monolog.js.map