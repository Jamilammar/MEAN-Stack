var config = {};

config.mongoUri = 'mongodb://localhost:27017/restaurant-db';
config.cookerMaxAge = 30 * 24 * 3600 * 1000;

module.exports = config;