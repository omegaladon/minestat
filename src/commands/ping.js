const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),

	async execute(interaction) {
		await interaction.deferReply();

		const embed = new EmbedBuilder()
			.setColor("Blue")
			.setAuthor({
				name: "Powered by the Torch API",
				iconURL: "https://torch.tyruschuang.com/logo.png",
				url: "https://torch.tyruschuang.com/api",
			})
			.setTitle(`🏓 Pong!`)
			.addFields(
				{
					name: `Latency`,
					value: `${Date.now() - interaction.createdTimestamp}ms`,
					inline: true,
				},
				{
					name: `API Latency`,
					value: `${Math.round(interaction.client.ws.ping)}ms`,
					inline: true,
				}
			)
			.setFooter({
				text: "Ping",
			})
			.setTimestamp();

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
