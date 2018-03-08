
let rp = require('request-promise')

let blockchain = require('../tools/blockchain')
const moment = require('moment');
import Order from '../db/models/order';

if(!process.env.UNPAID_WATCH_PERIOD_IN_HOURS) {
  console.log('Should set UNPAID_WATCH_PERIOD_IN_HOURS env.');
  process.exit(1);
}

;(async () => {
  while (1) {
    
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms))

    try{
      
      let btcorders = await Order.query(function(qb) {
        qb.where('status', '=', 'paid')
        .andWhere('created_at', '>=', moment().subtract(process.env.PAID_WATCH_PERIOD_IN_HOURS, 'hours').format('YYYY-MM-DD HH-mm-ss'))
        .andWhere('currency', '=', 'BTC');
      }).fetchAll();
      await processJobBTC(btcorders)
      await wait(1000 * 60)

    } catch (err) {
      console.log(err, 'From check payment');
    }
  }
})()

async function processJobBTC (orders) {

  orders.map(async (order)=>{

    let received = await blockchain.getreceivedbyaddress(order.get('address'))
    console.log('Check-Payment', 'address:', order.get('address'), 'expect:', order.get('crypto_amount'), 'confirmed:', received[1].result, 'unconfirmed:', received[0].result)

    // (orders.get('crypto_amount') > config.small_amount_threshhold && (received[1].result >= json.btc_to_ask)) ||
    let value = parseFloat(order.get('crypto_amount'));

    if (value <= received[1].result) {
        // paid ok
      order.set('status', 'paid');
      order.set('paid_on', moment().format('YYYY-MM-DD HH-mm-ss'));
      await order.save();

      // marked as paid and fired a callack. why not forward funds instantly?
      // because in case of zero-conf accepted balance we wound need to wait for a couple of
      // confirmations till we can forward funds
    }
  })
}
