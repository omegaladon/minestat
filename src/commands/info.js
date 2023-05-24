const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about Minestat.'),

    async execute(interaction) {
        await interaction.reply('info here!');
    }
}