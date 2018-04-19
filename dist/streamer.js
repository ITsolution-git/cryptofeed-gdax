"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const streamer_utilities_1 = require("./streamer_utilities");
const io = require('socket.io-client');
var dotenv = require('dotenv').load();
const moment = require('moment');
const quote_1 = require("./db/models/quote");
const quotelog_1 = require("./db/models/quotelog");
var currentPrice = {};
var socket = io.connect('https://streamer.cryptocompare.com/');
//Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
//Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
//For aggregate quote updates use CCCAGG as market
// , '5~CCCAGG~DASH~USD', '5~CCCAGG~XRP~USD'
var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~DASH~USD', '5~CCCAGG~BCH~USD', '5~CCCAGG~LTC~USD', '5~CCCAGG~BTG~USD', '5~CCCAGG~XRP~USD', '5~CCCAGG~ETC~USD'];
socket.emit('SubAdd', { subs: subscription });
socket.on("m", function (message) {
    var messageType = message.substring(0, message.indexOf("~"));
    var res = {};
    if (messageType == streamer_utilities_1.default.STATIC.TYPE.CURRENTAGG) {
        res = streamer_utilities_1.default.CURRENT.unpack(message);
        dataUnpack(res);
    }
});
var saveData = function (current) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let symbol = current.FROMSYMBOL + '-' + current.TOSYMBOL;
            let quote = yield quote_1.default.where({ symbol: symbol }).fetch();
            let value = {
                bid: 0,
                last: current.PRICE,
                ask: 0,
                change: current.CHANGE24HOUR,
                high: current.HIGH24HOUR,
                low: current.LOW24HOUR,
                open: current.OPENHOUR,
                prev_close: current.OPENHOUR,
                time: new Date(current.LASTUPDATE * 1000),
            };
            if (quote)
                quote.save(value);
            else
                new quote_1.default(__assign({}, value, { symbol: symbol })).save(null, { method: 'insert' });
            let quotelogs = quotelog_1.default.query(function (qb) {
                qb.where('time', '<=', moment().subtract(30, 'minutes').format('YYYY-MM-DD HH-mm-ss'));
            }).destroy();
            new quotelog_1.default(__assign({}, value, { symbol: symbol, timestamp: new Date().getTime() / 1000 })).save(null, { method: 'insert' });
        }
        catch (err) {
            console.log('Error: ', err);
        }
    });
};
var dataUnpack = function (data) {
    var from = data['FROMSYMBOL'];
    var to = data['TOSYMBOL'];
    var fsym = streamer_utilities_1.default.STATIC.CURRENCY.getSymbol(from);
    var tsym = streamer_utilities_1.default.STATIC.CURRENCY.getSymbol(to);
    var pair = from + to;
    if (!currentPrice.hasOwnProperty(pair)) {
        currentPrice[pair] = {};
    }
    for (var key in data) {
        currentPrice[pair][key] = data[key];
    }
    if (currentPrice[pair]['LASTTRADEID']) {
        currentPrice[pair]['LASTTRADEID'] = parseInt(currentPrice[pair]['LASTTRADEID']).toFixed(0);
    }
    currentPrice[pair]['CHANGE24HOUR'] = streamer_utilities_1.default.convertValueToDisplay(tsym, (currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']));
    currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";
    ;
    saveData(currentPrice[pair]);
};
//# sourceMappingURL=streamer.js.map