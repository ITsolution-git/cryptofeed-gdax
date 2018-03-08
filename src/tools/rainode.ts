let { client } = require('../classes/raiblocks-client');

let raiClient = client({
	rai_node_host: process.env.testnet == 'testnet' ? process.env.RAINODE_RPC : process.env.RAINODE_RPC_MAINNET
	
});

export function block_count () {
  return raiClient.block_count().then(response=>{
  	return response;
  })
}
