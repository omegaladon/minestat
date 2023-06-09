const { default: axios } = require("axios");
const {
	SlashCommandBuilder,
	AttachmentBuilder,
	EmbedBuilder,
} = require("discord.js");
const config = require("../config");

const GUILD_ID = config.dev_guild_id;
const IMAGE_CHANNEL_ID = config.image_channel_id;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("icon")
		.setDescription("Gets the icon of a Java Minecraft server.")
		.addStringOption((option) =>
			option
				.setName("ip")
				.setDescription("The IP of the server.")
				.setRequired(true)
		),

	async execute(interaction) {
		await interaction.deferReply();
		const ip = interaction.options.getString("ip");

		const apiLink = `https://api.torch.tyruschuang.com/icon/${ip}`;
		const response = await axios.get(apiLink);

		let iconUrl = interaction.client.iconCache.get(response.data.data);
		if (!iconUrl) {
			const buffer = Buffer.from(
				response.data.data.split(",")[1],
				"base64"
			);
			const attachment = new AttachmentBuilder(buffer, "icon.png");
			const message = await interaction.client.guilds.cache
				.get(GUILD_ID)
				.channels.cache.get(IMAGE_CHANNEL_ID)
				.send({ files: [attachment] });
			iconUrl = message.attachments.first().url;
			interaction.client.iconCache.set(response.data.data, iconUrl, 1200);
		}

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
					value: `${response.data.host}`,
					inline: true,
				},
				{
					name: `Port`,
					value: `${response.data.port}`,
					inline: true,
				}
			)
			.setImage(iconUrl)
			.setFooter({
				text: `Server Icon`,
			})
			.setTimestamp();

		await interaction.editReply({ embeds: [embed] });
	},
};
