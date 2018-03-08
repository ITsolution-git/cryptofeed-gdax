import client from '../classes/raiblocks-client';

let raiClient = client({
	rai_node_host: process.env.testnet == 'testnet' ? process.env.RAINODE_RPC : process.env.RAINODE_RPC_MAINNET
	
});

module.exports = raiClient;
