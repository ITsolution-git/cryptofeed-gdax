

let rp = require('request-promise')

let blockchain = require('../tools/blockchain')
let signer = require('../tools/signer')
const moment = require('moment');
import Order from '../db/models/order';

if(!process.env.PAID_WATCH_PERIOD_IN_HOURS) {
  console.log('Should set PAID_WATCH_PERIOD_IN_HOURS env.');
  process.exit(1);
}

;(async () => {
  while (1) {
    
    let wait = ms => new Promise(resolve => setTimeout(resolve, ms))

    try{
      
      let orders = await Order.query(function(qb) {
        qb.where('status', '=', 'paid').andWhere('created_at', '>=', moment().subtract(process.env.PAID_WATCH_PERIOD_IN_HOURS, 'hours').format('YYYY-MM-DD HH-mm-ss'));
      }).fetchAll();
      await processJob(orders)
      await wait(1000 * 60)

    } catch (err) {
      console.log(err, 'From send payment');
    }
  }
})()

async function processJob (orders) {

  orders.map(async (order)=>{
    let received = await blockchain.getreceivedbyaddress(order.get('address'))
    console.log('Send-Payment', 'address:', order.get('address'), 'expect:', order.get('btc_amount'), 'confirmed:', received[1].result, 'unconfirmed:', received[0].result)

    if (+received[1].result === +received[0].result && received[0].result > 0) { // balance is ok, need to transfer it
    
      let unspentOutputs = await blockchain.listunspent(order.get('address'))

      let createTx = signer.createTransaction
      if (order.get('address')[0] === '3') {
        // assume source address is SegWit P2SH
        // pretty safe to assume that since we generate those addresses
        createTx = signer.createSegwitTransaction
      }

      let tx = createTx(unspentOutputs.result, process.env.MYADDRESS, received[0].result, 0.0001, order.get('WIF'))
      console.log('Send-Payment', 'broadcasting', tx)
      let broadcastResult = await blockchain.broadcastTransaction(tx)
      console.log('Send-Payment', 'broadcast result:', JSON.stringify(broadcastResult))

      order.set('status', 'paid_and_sweeped')
      order.set('transaction', JSON.stringify(tx));
      order.set('broadcast_result', JSON.stringify(broadcastResult));

      await order.save();
  }
  })
}
