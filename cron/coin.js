
require('babel-polyfill');
const config = require('../config');
const { exit, rpc } = require('../lib/cron');
const fetch = require('../lib/fetch');
const locker = require('../lib/locker');
const moment = require('moment');
// Models.
const Coin = require('../model/coin');

/**
 * Get the coin related information including things
 * like price crex24.com data.
 */
async function syncCoin() {
  const date = moment().utc().startOf('minute').toDate();
  // Setup the crex24.com api url.
  const url = `${ config.crex24.api }`;
  const btcurl = `${ config.crex24btc.api }`;

  const info = await rpc.call('getinfo');
  const masternodes = await rpc.call('getmasternodecount');
  const maxnodes = await rpc.call('getmaxnodecount');
  const nethashps = await rpc.call('getnetworkhashps');

  let market = await fetch(url);
  if (Array.isArray(market)) {
    market = market.length ? market[0] : {};
  }

  let cbtcusd = await fetch(btcurl);
  if (Array.isArray(cbtcusd)) {
    cbtcusd = cbtcusd.length ? cbtcusd[0] : {};
  }

  let btcusdprc = cbtcusd.last;
  let btcprc = (market.last).toFixed(12);
  let usdprc = (btcusdprc * btcprc);

  const coin = new Coin({
    cap: market.volumeInUsd,
    createdAt: date,
    blocks: info.blocks,
    btc: (market.last).toFixed(12),
    diff: info.difficulty,
    mnsOff: masternodes.total - masternodes.stable,
    mnsOn: masternodes.stable,
    maxsOff: maxnodes.total - maxnodes.stable,
    maxsOn: maxnodes.stable,
    netHash: nethashps,
    peers: info.connections,
    status: 'Online',
    supply: info.moneysupply,
    usd: usdprc
  });

//process.stdout.write("BTC" + btcprc + " " + "USD" + usdprc);


  await coin.save();
}


/**
 * Handle locking.
 */
async function update() {
  const type = 'coin';
  let code = 0;

  try {
    locker.lock(type);
    await syncCoin();
  } catch(err) {
    console.log(err);
    code = 1;
  } finally {
    try {
      locker.unlock(type);
    } catch(err) {
      console.log(err);
      code = 1;
    }
    exit(code);
  }
}

update();
