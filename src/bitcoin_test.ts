
let bitcoind = require('./tools/blockchain')
let rp = require('request-promise')

let assert = require('assert')

;(async () => {
  try {
    let info = await bitcoind.getblockchaininfo()
    assert(info.result.chain)
  } catch (err) {
    console.log('Bitcoin Core RPC problem: ', err)
    process.exit(1)
  }
})()
