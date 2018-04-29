import CCC from './streamer_utilities';
const io = require('socket.io-client');
var dotenv = require('dotenv').load();
const moment = require('moment');
import Quote from './db/models/quote';
import Quotelog from './db/models/quotelog';

var currentPrice = {};
var socket = io.connect('https://streamer.cryptocompare.com/');
//Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
//Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
//For aggregate quote updates use CCCAGG as market
// , '5~CCCAGG~DASH~USD', '5~CCCAGG~XRP~USD'
var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~DASH~USD', '5~CCCAGG~BCH~USD', '5~CCCAGG~LTC~USD', '5~CCCAGG~BTG~USD', '5~CCCAGG~XRP~USD', '5~CCCAGG~ETC~USD'];
socket.emit('SubAdd', { subs: subscription });
socket.on("m", function(message) {
	var messageType = message.substring(0, message.indexOf("~"));
	var res = {};
	if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
		res = CCC.CURRENT.unpack(message);
		dataUnpack(res);
	}
});

var saveData = async function(current) {
	try {
		let symbol = current.FROMSYMBOL + '-' + current.TOSYMBOL;
		let quote = await Quote.where({symbol: symbol}).fetch();
		var Bookshelf = require('./db/bookshelf');

		let query =`update quote SET bid=0, last=${current.PRICE}, ask=0,  \`change\`=${current.CHANGE24HOUR.slice(2)},
		 high=${current.HIGH24HOUR}, low=${current.LOW24HOUR}, 
			open=${current.OPENHOUR} , prev_close=${current.OPENHOUR}, time=NOW() 
			where symbol='${symbol}'`

		Bookshelf.knex.raw(query).then(()=>{});
		// let value = {
		// 	bid: 0,
		// 	last: current.PRICE,
		// 	ask: 0,
		// 	change: current.CHANGE24HOUR,
		// 	high: current.HIGH24HOUR,
		// 	low: current.LOW24HOUR,
		// 	open: current.OPENHOUR,
		// 	prev_close: current.OPENHOUR,
		// 	time: moment.utc().format()
		// }
		
		// if(quote)
		// 	quote.save(value);
		// else
		// 	new Quote({...value, symbol: symbol}).save(null, {method: 'insert'});
		
		Bookshelf.knex.raw(`select priceid from quotelog where timestamp < (UNIX_TIMESTAMP() - 30 * 60)`)
		.then(res=>{
			if(res[0].length > 0){
				res[0].map(str=>{
					let q = `DELETE FROM quotelog WHERE priceid=${str.priceid}`;
					Bookshelf.knex.raw(q).then(console.log);
				})
			}
		})

		let queryquotelog =`insert into quotelog (symbol,bid,last,ask,\`change\`,high,low,open,prev_close,time,timestamp)
		values('${symbol}',0,${current.PRICE},0,${current.CHANGE24HOUR.slice(2)},${current.HIGH24HOUR},${current.LOW24HOUR},
		${current.OPENHOUR},${current.OPENHOUR},NOW(),UNIX_TIMESTAMP())`

		Bookshelf.knex.raw(queryquotelog).then(res=>{
		});
		
	} catch(err) {
		console.log('Error: ', err);
	}
}


var dataUnpack = function(data) {
	var from = data['FROMSYMBOL'];
	var to = data['TOSYMBOL'];
	var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
	var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
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
	currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']));
	currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";;

	saveData(currentPrice[pair])
};
