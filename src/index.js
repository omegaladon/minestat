const Bot = require("./bot");

require("dotenv").config();
const TOKEN = process.env.TOKEN;

const bot = new Bot(TOKEN);
bot.registerCommands();
bot.registerEvents();
bot.login();

module.exports = bot;
