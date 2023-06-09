const Bot = require("./bot");

require("dotenv").config();
const TOKEN = process.env.TOKEN;

const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("👋");
});

const bot = new Bot(TOKEN);
bot.registerCommands();
bot.registerEvents();
bot.login();

module.exports = bot;
