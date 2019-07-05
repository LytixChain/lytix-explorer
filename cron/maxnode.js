
require('babel-polyfill');
require('../lib/cron');
const config = require('../config');
const { exit, rpc } = require('../lib/cron');
const fetch = require('../lib/fetch');
const { forEach } = require('p-iteration');
const locker = require('../lib/locker');
const moment = require('moment');
// Models.
const Maxnode = require('../model/maxnode');

/**
 * Get a list of the maxs and request IP information
 * from freegeopip.net.
 */
async function syncMaxnode() {
  const date = moment().utc().startOf('minute').toDate();

  await Maxnode.remove({});

  // Increase the timeout for maxnode.
  rpc.timeout(10000); // 10 secs

  const maxs = await rpc.call('maxnode', ['list']);
  const inserts = [];
  await forEach(maxs, async (max) => {
    const maxnode = new Maxnode({
      active: max.activetime,
      addr: max.addr,
      createdAt: date,
      lastAt: new Date(max.lastseen * 1000),
      lastPaidAt: new Date(max.lastpaid * 1000),
      network: max.network,
      rank: max.rank,
      status: max.status,
      txHash: max.txhash,
      txOutIdx: max.outidx,
      ver: max.version
    });

    inserts.push(maxnode);
  });

  if (inserts.length) {
    await Maxnode.insertMany(inserts);
  }
}

/**
 * Handle locking.
 */
async function update() {
  const type = 'maxnode';
  let code = 0;

  try {
    locker.lock(type);
    await syncMaxnode();
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
