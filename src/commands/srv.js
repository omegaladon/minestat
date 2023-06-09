const { default: axios } = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("srv")
		.setDescription("Gets the srv record of a Java Minecraft server.")
		.addStringOption((option) =>
			option
				.setName("host")
				.setDescription("The hostname of the server.")
				.setRequired(true)
		),

	async execute(interaction) {
		await interaction.deferReply();
		const host = interaction.options.getString("host");

		const apiLink = `https://api.torch.tyruschuang.com/srv/${host}`;
		const response = await axios.get(apiLink);

		const embed = new EmbedBuilder()
			.setColor("Green")
			.setAuthor({
				name: "Powered by the Torch API",
				iconURL: "https://torch.tyruschuang.com/logo.png",
				url: "https://torch.tyruschuang.com/api",
			})
			.addFields(
				{
					name: `Host`,
					value: `${host}`,
					inline: true,
				},
				{
					name: `Target`,
					value: `${response.data.target}`,
					inline: false,
				},
				{
					name: `Port`,
					value: `${response.data.port}`,
					inline: true,
				}
			)
			.setFooter({
				text: "SRV Record",
			})
			.setTimestamp();

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
