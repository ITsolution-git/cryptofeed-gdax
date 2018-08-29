const Gdax = require('../gdax');
const publicClient = new Gdax.PublicClient();

var dotenv = require('dotenv').load();
const moment = require('moment');
import Quote from './db/models/quote';
import Quotelog from './db/models/quotelog';

// const websocket = new Gdax.WebsocketClient(
//   ['BTC-USD', 'ETH-USD' ,'DASH~USD', 'BCH-USD', 'LTC-USD', 'BTG-USD', 'XRP-USD', 'ETC-USD'],
//   'wss://ws-feed-public.sandbox.gdax.com',
//   { channels: ['ticker'] });
 
// websocket.on('message', data => {
// 	console.log(data);
// });
// websocket.on('error', err => {
//   	console.log(err, 'err');
// });

// websocket.on('close', (err) => {
//   	console.log(err);
// });



const bittrex = require('./bittrex-wrapper');

bittrex.options({
  'verbose' : true,
});

bittrex.options({
  verbose: true,
  websockets: {
    onConnect: function() {
      console.log('onConnect fired', bittrex.websockets.subscribeTicker);
      bittrex.websockets.listen(function(data, client) {

      	if (data && data.A && data.A[0].Deltas) {
      		data.A[0].Deltas.map(item => {
      			
      			if (item.MarketName == 'USDT-DASH')

      				
					saveData({bid: item.Bid, lastPrice: item.Last, ask: item.Ask, dailyChange:0, high: item.High, low: item.Low, open: 0, prev_close: 0,   symbol: 'DASH-USD'});
      		})
      	}
      });
  },
});

console.log('Connecting ....');
bittrex.websockets.client(function(client) {
  console.log('Connected');
});




const BFX = require('bitfinex-api-node')
const bfx = new BFX({

})
const ws = bfx.ws(2, { transform: true })

ws.on('open', () => {
	ws.subscribeTicker('tBTCUSD')
	ws.subscribeTicker('tETHUSD')
	// ws.subscribeTicker('tDASHUSD')
	ws.subscribeTicker('tBCHUSD')
	ws.subscribeTicker('tLTCUSD')
	ws.subscribeTicker('tBTGUSD')
	ws.subscribeTicker('tXRPUSD')
	ws.subscribeTicker('tETCUSD')
});

ws.on('ticker', (pair, ticker) => {
	let symbol = '';
	switch(pair) {
		case 'tBTCUSD':
			symbol = 'BTC-USD';
			break;
		case 'tETHUSD':
			symbol = 'ETH-USD';
			break;
		case 'tDASHUSD':
			symbol = 'DASH-USD';
			break;
		case 'tBCHUSD':
			symbol = 'BCH-USD';
			break;
		case 'tLTCUSD':
			symbol = 'LTC-USD';
			break;
		case 'tBTGUSD':
			symbol = 'BTG-USD';
			break;
		case 'tXRPUSD':
			symbol = 'XRP-USD';
			break;
		case 'tETCUSD':
			symbol = 'ETC-USD';
			break;
	}
	if (symbol) {
		saveData({...ticker, symbol: symbol})	
	}
})
ws.open();
var saveData = async function(current) {
	try {
		let symbol = current.symbol;
		let quote = await Quote.where({symbol: symbol}).fetch();
		var Bookshelf = require('./db/bookshelf');

		let query =`update quote SET bid=${current.bid}, last=${current.lastPrice}, ask=${current.ask},  \`change\`=${current.dailyChange},
		 high=${current.high}, low=${current.low}, 
			open=0 , prev_close=0, time=NOW() 
			where symbol='${symbol}'`

		Bookshelf.knex.raw(query).then(()=>{});
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
		values('${symbol}',${current.bid},${current.lastPrice},${current.ask},${current.dailyChange},${current.high},${current.low},0,0,NOW(),UNIX_TIMESTAMP())`
		
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
