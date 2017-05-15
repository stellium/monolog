"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monolog_1 = require("./monolog");
var common_1 = require("@stellium/common");
common_1.DefineCurrentModule('test');
var monologClient = monolog_1.Monolog.createClient();
setTimeout(function () {
    console.log('Attempting to send message');
    monologClient.log({
        message: 'test'
    });
}, 1000);
//# sourceMappingURL=test.js.map