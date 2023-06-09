const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Get an invite link for the Minestat bot."),

	async execute(interaction) {
		await interaction.deferReply();

		const embed = new EmbedBuilder()
			.setColor("Blue")
			.setAuthor({
				name: "Powered by the Torch API",
				iconURL: "https://torch.tyruschuang.com/logo.png",
				url: "https://torch.tyruschuang.com/api",
			})
			.setTitle(`💌 Invite Minestat`)
			.setDescription(`Invite Minestat to your server using this invite link!\nhttps://discord.com/api/oauth2/authorize?client_id=1110962137276371045&permissions=2048&scope=bot%20applications.commands`)
			.setFooter({
				text: "Invite",
			})
			.setTimestamp();

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
