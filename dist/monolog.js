"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
var containerized = require("containerized");
var amqlib = require('amqplib/callback_api');
var getErrorColor = function (config) {
    var severity = config.severity || 'severe';
    var color = 'red';
    switch (severity) {
        case 'moderate':
            color = 'yellow';
            break;
        case 'light':
            color = 'green';
            break;
        case 'ignore':
            color = 'blue';
            break;
    }
    return color;
};
var strLimit = 80;
var fillRemainingSpace = function (length) {
    var spaces = '';
    for (var i = 0; i < strLimit - length; i++)
        spaces += ' ';
    return spaces;
};
var truncateMessage = function (message) {
    if (message.length <= strLimit)
        return "| " + message + fillRemainingSpace(message.length) + " |";
    else
        return "| " + message + " |";
};
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
amqlib.connect("amqp://" + (containerized() ? 'rabbit' : 'localhost'), function (err, conn) {
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
            throw new Error('Rabbit Channel has not been initialised yet');
        }
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        var q = 'monolog';
        rabbitChannel.assertQueue(q, { durable: false });
        rabbitChannel.sendToQueue(q, Buffer.from(message));
    };
    return Monolog;
}());
exports.Monolog = Monolog;
//# sourceMappingURL=monolog.js.map