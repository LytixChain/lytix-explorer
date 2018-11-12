
/**
 * Global configuration object.
 */
const config = {
  'api': {
    'host': 'http://explorer.lytixchain.org',
    'port': '443',
    'prefix': '/api',
    'timeout': '5s'
  },
  'coinMarketCap': {
    'api': 'http://api.coinmarketcap.com/v1/ticker/',
    'ticker': 'lytix'
  },
  'db': {
    'host': '127.0.0.1',
    'port': '27017',
    'name': 'blockex',
    'user': 'blockexuser',
    'pass': 'Explorer!1'
  },
  'freegeoip': {
    'api': 'https://extreme-ip-lookup.com/json/'
  },
  'rpc': {
    'host': '127.0.0.1',
    'port': '27073',
    'user': 'lytixrpc',
    'pass': 'someverysafepassword',
    'timeout': 8000, // 8 seconds
  }
};

module.exports = config;
