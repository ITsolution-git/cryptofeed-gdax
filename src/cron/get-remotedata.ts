
let rp = require('request-promise')


const moment = require('moment');
import Trade from '../db/models/trade';


async function runTradeCron (){
  while (1) {
    
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    if(global.tradeCron){
      try{
         
        let maxTimestamp = await Trade.query(function(qb) {
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
          options.body.start = parseInt(maxTimestamp.get('timestamp')) + 1;
        

        let response = await rp(options);
        var promises = [];
        for(let market in response)
          response[market].map(res=>{
            promises.push(new Trade(Object.assign(res, {market: market})).save() );
          })
        await Promise.all(promises);
        console.log('Got Trade Data from ' + parseInt(maxTimestamp.get('timestamp')) + 1);
        
      } catch (err) {
        console.log(err, 'From Get Trade Data');
      }
    } else {
      console.log('Cancelled');
    } 
    await wait(1000 * 30)
  }
}

runTradeCron();