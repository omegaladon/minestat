const Bot = require('./bot');

require('dotenv').config()
const TOKEN = process.env.TOKEN;
const MODE = process.env.MODE;

const bot = new Bot(TOKEN, MODE);
bot.registerCommands();
bot.registerEvents();
bot.login();

module.exports = bot;