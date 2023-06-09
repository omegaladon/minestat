const Bot = require("./bot");
const config = require("./config");

require("dotenv").config();
const TOKEN = process.env.TOKEN;
const MODE = config.mode;

const bot = new Bot(TOKEN, MODE);
bot.registerCommands();
bot.registerEvents();
bot.login();

module.exports = bot;
