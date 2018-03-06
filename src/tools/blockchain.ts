	


let jayson = require('jayson/promise')
let url = require('url')
let rpc;
if(process.env.NET == 'testnet')
  rpc = url.parse(process.env.BITCOIND_RPC)
else
  rpc = url.parse(process.env.BITCOIND_RPC_MAINNET)

rpc.timeout = 5000
let client = jayson.client.http(rpc)

function importaddress (address) {
  return client.request('importaddress', [address, address, false])
}

// [adress, confirmed_count]  0 for unconfirmed and , 1 is counted automatically by  me.
function getreceivedbyaddress (address) {
  let reqs = [
    client.request('getreceivedbyaddress', [address, 0]),
    client.request('getreceivedbyaddress', [address, 1])
  ]

  return Promise.all(reqs)
}

function getblockchaininfo () {
  return client.request('getblockchaininfo', [])
}

function listunspent (address) {
  return client.request('listunspent', [0, 9999999, [address], true])
}

function broadcastTransaction (tx) {
  return client.request('sendrawtransaction', [tx])
}

exports.importaddress = importaddress
exports.getreceivedbyaddress = getreceivedbyaddress
exports.getblockchaininfo = getblockchaininfo
exports.listunspent = listunspent
exports.broadcastTransaction = broadcastTransaction
