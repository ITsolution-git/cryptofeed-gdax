
let bitcoind = require('./tools/blockchain')
let rainode = require('./tools/rainode')
let rp = require('request-promise')

let assert = require('assert')

;(async () => {
  try {
    let info = await bitcoind.getblockchaininfo()
    assert(info.result.chain)
    console.error('Blockchain node LIVE');
  } catch (err) {
    console.log('Bitcoin Core RPC problem: ', err)
    // process.exit(1)
  }
})()

;(async () => {
  try {
    let info = await rainode.block_count()
    assert(info)
    console.error('RAI node LIVE');
  } catch (err) {
    console.log('RaiNode Core RPC problem: ', err)
    // process.exit(1)
  }

  try {
    let valid = await rainode.password_valid({wallet: process.env.MYNANOWALLET})

    if( valid.valid !== '1' ) {
      let result = await rainode.password_enter({wallet:process.env.MYNANOWALLET, password: process.env.MYNANOWALLET_PASSWORD})
      if( result.valid !== '1' ) {
        console.error('RaiNode Cannot Unload with that password');
        // process.exit(1)
      } else {
        console.error('Unlocked Nano Wallet');
      }
    }

  } catch (err) {
    console.log('RaiNode Error while unlocking :  ', err)
    // process.exit(1)
  }
})()

