
let rp = require('request-promise')


const moment = require('moment');
import IdexTrade from '../db/models/idex_trade';
import BittrexTrade from '../db/models/bittrex_trade';

async function runTradeCronForIdex (){
  while (1) {
    
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    if(global.tradeCron){
      try{
         
        let maxTimestamp = await IdexTrade.query(function(qb) {
          qb.max('timestamp as timestamp');
        }).fetch();

        var options = {
          method: 'POST',
          uri: 'https://api.idex.market/returnTradeHistory ',
          body: {
          },
          json: true // Automatically stringifies the body to JSON
        };

        if(maxTimestamp.get('timestamp')) 
          options.body["start"] = parseInt(maxTimestamp.get('timestamp')) + 1;
        

        let response = await rp(options);
        var promises = [];
        for(let market in response)
          response[market].map(res=>{
            promises.push(new IdexTrade(Object.assign(res, {market: market})).save() );
          })
        await Promise.all(promises);
        console.log('Got IdexTrade Data from ' + parseInt(maxTimestamp.get('timestamp')) + 1);
        
      } catch (err) {
        console.log(err, 'From Get IdexTrade Data');
      }
    } else {
      console.log('Cancelled IdexTrade');
    } 
    await wait(1000 * 30)
  }
}


async function runTradeCronForBittrex (){
  let markets = await rp({
    method: 'GET',
    uri: 'https://bittrex.com/api/v1.1/public/getmarkets',
    json: true // Automatically stringifies the body to JSON
  })
  while (1) {
    
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    if(global.tradeCron){
      try{
        
        let promises = [];
        markets.result.map(market=>{
          promises.push(rp({
            method: 'POST',
            uri: 'https://bittrex.com/api/v1.1/public/getmarkethistory?market='+market.MarketName,
            body: {
            },
            json: true // Automatically stringifies the body to JSON
          }));  
        })
        

        let currentTrades = await BittrexTrade.where({}).fetchAll();
        currentTrades = currentTrades.toJSON().map(trade=>trade['Id'])
        
        let responses = await Promise.all(promises);

        let tradesToAdd = [];
        for (var j = 0; j < markets.result.length; j += 10) {
          tradesToAdd = [];
          responses.slice(j, j+10).map((item, index)=>{
            
            if(item.result)
              item.result.map(item=>{
                
                if(currentTrades.indexOf(item['Id']) == -1)
                  tradesToAdd.push(new BittrexTrade(Object.assign(item, {market: markets.result[j+index].MarketName})).save() );
              })
          })

          await Promise.all(tradesToAdd);
          console.log('Got Bittrex ' + tradesToAdd.length);
        }
          
        
      } catch (err) {
        console.log(err, 'From Get Trade Data');
      }
    } else {
      console.log('Cancelled');
    } 
    await wait(1000 * 30)
  }
}

runTradeCronForIdex();
runTradeCronForBittrex();