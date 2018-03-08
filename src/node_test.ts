
let bitcoind = require('./tools/blockchain')
let rainode = require('./tools/rainode')
let rp = require('request-promise')

let assert = require('assert')

;(async () => {
  try {
    let info = await bitcoind.getblockchaininfo()
    assert(info.result.chain)
  } catch (err) {
    console.log('Bitcoin Core RPC problem: ', err)
    // process.exit(1)
  }
})()

;(async () => {
  try {
    let info = await rainode.block_count()
    console.log(info)
    assert(info)
  } catch (err) {
    console.log('RaiNode Core RPC problem: ', err)
    // process.exit(1)
  }
})()

