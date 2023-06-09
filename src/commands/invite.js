const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Get an invite link for the Minestat bot."),

	async execute(interaction) {
		await interaction.deferReply();
		await interaction.editReply({
			content: "Invite me to your server! https://discord.com/api/oauth2/authorize?client_id=1110962137276371045&permissions=8&scope=bot%20applications.commands",
		});
	},
};
