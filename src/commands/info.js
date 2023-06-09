const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Get info about the Minestat bot."),

	async execute(interaction) {
		await interaction.deferReply();

		const embed = new EmbedBuilder()
			.setColor("Blue")
			.setAuthor({
				name: "Powered by the Torch API",
				iconURL: "https://torch.tyruschuang.com/logo.png",
				url: "https://torch.tyruschuang.com/api",
			})
			.setTitle(`Info`)
			.setDescription(
				`Minestat is a Discord bot that is able to get information about any online Minecraft server, both for Java and Bedrock editions. Minestat is powered by the Torch API, which is a free and open-source Minecraft server status API.`
			)
			.addFields(
				{
					name: `Version`,
					value: `v${require("../../package.json").version}`,
					inline: true,
				},
				{
					name: `Author`,
					value: `omega`,
					inline: true,
				},
				{
					name: `Source Code`,
					value: `[GitHub](
						https://github.com/
						)`,
					inline: true,
				},
				{
					name: `Invite`,
					value: `[Click me!](
						https://discord.com/api/oauth2/authorize?client_id=1110962137276371045&permissions=2048&scope=bot%20applications.commands
						)`,
					inline: true,
				},
				{
					name: `Guilds`,
					value: `${interaction.client.guilds.cache.size}`,
					inline: true,
				},
				{
					name: `Users`,
					value: `${interaction.client.users.cache.size}`,
					inline: true,
				},
				{
					name: `Uptime`,
					value: `${Math.floor(
						interaction.client.uptime / 1000 / 60 / 60
					)}h ${Math.floor(
						(interaction.client.uptime / 1000 / 60) % 60
					)}m ${Math.floor(
						(interaction.client.uptime / 1000) % 60
					)}s`,
					inline: true,
				}
			)
			.setFooter({
				text: "Info",
			})
			.setTimestamp();

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
