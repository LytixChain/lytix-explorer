
import blockchain from '../../../lib/blockchain';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './Card';

const CardROI = ({ coin, supply }) => {
  const mncoins = blockchain.mncoins;
  const maxcoins = blockchain.maxcoins;
  const mns = coin.mnsOff + coin.mnsOn;
  const maxs = coin.maxsOff + coin.maxsOn;
  const subsidy = blockchain.getMNSubsidy(coin.blocks, mns, coin.supply);
  const roi = blockchain.getROI(subsidy, coin.mnsOn);
  const maxroi = blockchain.getMAXROI(subsidy, coin.maxsOn);

  return (
    <Card>
      <div className="mb-3">
        <div className="h3">
          { coin.mnsOn } / { mns }
        </div>
        <div className="h5">
          Active/Total Masternodes
        </div>
      </div>
      <div className="mb-3">
        <div className="h3">
          { numeral(roi).format('0,0.0000') }%
        </div>
        <div className="h5">
          Estimated Masternode ROI
        </div>
      </div>
       <div className="mb-3">
        <div className="h3">
          { coin.maxsOn } / { maxs }
        </div>
        <div className="h5">
          Active/Total Maxnodes
        </div>
      </div>
      <div className="mb-3">
        <div className="h3">
          { numeral(maxroi).format('0,0.0000') }%
        </div>
        <div className="h5">
          Estimated Maxnode ROI
        </div>
      </div>

      <div className="mb-3">
        <div className="h3">
          { numeral(supply ? supply.t : 0.0).format('0,0.0000') } LYTX
        </div>
        <div className="h5">
          Coin Supply (Total)
        </div>
      </div>
      <div className="mb-3">
        <div className="h3">
          { numeral(supply ? supply.c - (mns * mncoins) : 0.0).format('0,0.0000') } LYTX
        </div>
        <div className="h5">
          Coin Supply (Circulating)
        </div>
      </div>
      <div className="mb-3">
        <div className="h3">
          { numeral(coin.cap * coin.btc).format('0,0.0000') } BTC
        </div>
        <div className="h5">
          Volume Cap BTC
        </div>
      </div>
      <div className="mb-3">
        <div className="h3">
          { numeral(coin.cap).format('$0,0.00') }
        </div>
        <div className="h5">
          Volume Cap USD
        </div>
      </div>
      <div className="mb-3">
        <div className="h3">
          { numeral((mns * mncoins) + (maxs * maxcoins)).format('0,0.0000') } LYTX
        </div>
        <div className="h5">
          Coins Locked
        </div>
      </div>
      <div className="mb-3">
        <div className="h3">
          { numeral(mncoins * coin.btc).format('0,0.0000') } BTC / { numeral(mncoins * coin.usd).format('$0,0.00') }
        </div>
        <div className="h5">
          Masternode Worth
        </div>
      </div>
      <div className="mb-3">
        <div className="h3">
          { numeral(maxcoins * coin.btc).format('0,0.0000') } BTC / { numeral(maxcoins * coin.usd).format('$0,0.00') }
        </div>
        <div className="h5">
          Maxnode Worth
        </div>
      </div>
    </Card>
  );
};

CardROI.propTypes = {
  coin: PropTypes.object.isRequired,
  supply: PropTypes.object.isRequired
};

export default CardROI;
