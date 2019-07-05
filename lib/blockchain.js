
const params = {
  LAST_POW_BLOCK: 100000, // 345600
  RAMP_TO_BLOCK: 50,
  LAST_SEESAW_BLOCK: 0
};

const avgBlockTime = 60; // 1.5 minutes (90 seconds)

const blocksPerDay = (24 * 60 * 60) / avgBlockTime; // 960

const blocksPerWeek = blocksPerDay * 7; // 6720

const blocksPerMonth = (blocksPerDay * 365.25) / 12; // 29220

const blocksPerYear = blocksPerDay * 365.25; // 350640

// Masternodes
//


const mncoins = 5000.0;

const getMNBlocksPerDay = (mns) => {
  return blocksPerDay / mns;
};

const getMNBlocksPerWeek = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 52);
};

const getMNBlocksPerMonth = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 12);
};

const getMNBlocksPerYear = (mns) => {
  return getMNBlocksPerDay(mns) * 365.25;
};


const getMNSubsidy = (nHeight = 0, nMasternodeCount = 0, nMoneySupply = 0) => {
  const blockValue = getSubsidy(nHeight);
  let ret = 0.0;

  if (nHeight <= 100000) {
    ret = 15;
    } else if (nHeight > 100000) {
        ret = blockValue  * 0.4;
    } else {	
        ret = blockValue  * 0.4;
   }

  return ret;
};

// Maxnodes
//
const maxcoins = 100000.0;

const getMAXBlocksPerDay = (maxs) => {
  return blocksPerDay / maxs;
};

const getMAXBlocksPerWeek = (maxs) => {
  return getMAXBlocksPerDay(maxs) * (365.25 / 52);
};

const getMAXBlocksPerMonth = (maxs) => {
  return getMAXBlocksPerDay(maxs) * (365.25 / 12);
};

const getMAXBlocksPerYear = (maxs) => {
  return getMAXBlocksPerDay(maxs) * 365.25;
};


const getMAXSubsidy = (nHeight = 0, nMaxnodeCount = 0, nMoneySupply = 0) => {
  const blockValue = getSubsidy(nHeight);
  let maxret = 0.0;

  if (nHeight <= 100000) {
    maxret = 15;
    } else if (nHeight > 100000) {
        maxret = blockValue  * 0.3;
    } else {
        maxret = blockValue  * 0.3;
   }

  return maxret;
};


const getSubsidy = (nHeight = 1) => {
  let nSubsidy = 30.0;
  let nSlowSubsidy = 30.0;

  if (nHeight === 1) {
    nSubsidy = 989720.00;
  } else if (nHeight < 50) {
    nSubsidy = 1;
  } else if (nHeight < 50) {
    nSubsidy = 1;
  } else if (nHeight < 100000) {
    nSubsidy = 30;
  } else if (nHeight < 110000) {
    nSubsidy = 100;
  } else if (nHeight < 300000) {
    nSubsidy = 30;
  } else if (nHeight < 350000) {
    nSubsidy = 15;
  } else if (nHeight < 700000) {
    nSubsidy = 10;
  } else if (nHeight < 1050000) {
    nSubsidy = 7;
  } else if (nHeight < 1400000) {
    nSubsidy = 5;
  } else if (nHeight < 1750000) {
    nSubsidy = 3;
  } else if (nHeight >= 2100000) {
    nSubsidy = 1;
  }

  return nHeight >= params.RAMP_TO_BLOCK ? nSubsidy : nSlowSubsidy;
};

const getROI = (subsidy, mns) => {
  return ((getMNBlocksPerYear(mns) * subsidy) / mncoins) * 100.0;
};

const getMAXROI = (subsidy, maxs) => {
  return ((getMAXBlocksPerYear(maxs) * subsidy) / maxcoins) * 100.0;
};

const isAddress = (s) => {
  return typeof(s) === 'string' && s.length === 34;
};

const isBlock = (s) => {
  return !isNaN(s) || (typeof(s) === 'string');
};

const isPoS = (b) => {
  return !!b && b.height > params.LAST_POW_BLOCK; // > 182700
};

const isTX = (s) => {
  return typeof(s) === 'string' && s.length === 64;
};

module.exports = {
  avgBlockTime,
  blocksPerDay,
  blocksPerMonth,
  blocksPerWeek,
  blocksPerYear,
  mncoins,
  maxcoins,
  params,
  getMNBlocksPerDay,
  getMNBlocksPerMonth,
  getMNBlocksPerWeek,
  getMNBlocksPerYear,
  getMNSubsidy,
  getMAXBlocksPerDay,
  getMAXBlocksPerMonth,
  getMAXBlocksPerWeek,
  getMAXBlocksPerYear,
  getMAXSubsidy,
  getSubsidy,
  getROI,
  getMAXROI,
  isAddress,
  isBlock,
  isPoS,
  isTX
};
