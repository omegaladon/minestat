const { default: axios } = require("axios");
const {
	SlashCommandBuilder,
	EmbedBuilder,
	AttachmentBuilder,
} = require("discord.js");
const config = require("../config");

const GUILD_ID = config.dev_guild_id;
const IMAGE_CHANNEL_ID = config.image_channel_id;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Gets the status of a Minecraft server.")
		.addStringOption((option) =>
			option
				.setName("ip")
				.setDescription("The IP of the server.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("The type of server.")
				.setRequired(false)
				.addChoices(
					{
						name: "Java",
						value: "java",
					},
					{
						name: "Bedrock",
						value: "bedrock",
					}
				)
		),

	async execute(interaction) {
		await interaction.deferReply();
		const ip = interaction.options.getString("ip");
		const type = interaction.options.getString("type") || "java";

		const apiLink = `https://api.torch.tyruschuang.com/status/${type}/${ip}`;
		const response = await axios.get(apiLink);

		let embed;

		if (response.data.offline) {
			embed = new EmbedBuilder()
				.setColor("Red")
				.setTitle("Server Offline")
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
				.setFooter({
					text: `${
						type.charAt(0).toUpperCase() +
						type.substr(1).toLowerCase()
					} Server Status`,
				})
				.setTimestamp();
		} else {
			let iconUrl = interaction.client.iconCache.get(response.data.icon);
			if (!iconUrl) {
				const buffer = Buffer.from(
					response.data.icon.split(",")[1],
					"base64"
				);
				const attachment = new AttachmentBuilder(buffer, "icon.png");
				const message = await interaction.client.guilds.cache
					.get(GUILD_ID)
					.channels.cache.get(IMAGE_CHANNEL_ID)
					.send({ files: [attachment] });
				iconUrl = message.attachments.first().url;
				interaction.client.iconCache.set(
					response.data.icon,
					iconUrl,
					1200
				);
			}

			const fields = [
				{
					name: `Host`,
					value: `${response.data.host}`,
					inline: true,
				},
				{
					name: `Port`,
					value: `${response.data.port}`,
					inline: true,
				},
				{
					name: `Version`,
					value: `${response.data.version.name.clean}`,
					inline: false,
				},
				{
					name: `Protocol`,
					value: `${response.data.version.protocol}`,
					inline: false,
				},
				{
					name: `Players`,
					value: `${response.data.players.online} / ${response.data.players.max}`,
					inline: false,
				},
			];

			if (response.data.players.sample.length > 0) {
				fields.push({
					name: `Player List`,
					value: `\n\`\`\`${response.data.players.sample
						.map((player) => player.name.clean)
						.join("\n")}\`\`\``,
				});
			}

			fields.push({
				name: `MOTD`,
				value: `\`\`\`\n${response.data.description.clean}\n\`\`\``,
				inline: false,
			});

			embed = new EmbedBuilder()
				.setColor("Green")
				.setTitle("Server Online")
				.setAuthor({
					name: "Powered by the Torch API",
					iconURL: "https://torch.tyruschuang.com/logo.png",
					url: "https://torch.tyruschuang.com/api",
				})
				.addFields(...fields)
				.setFooter({
					text: `${
						type.charAt(0).toUpperCase() +
						type.substr(1).toLowerCase()
					} Server Status`,
				})
				.setTimestamp()
				.setThumbnail(iconUrl);
		}
		await interaction.editReply({ embeds: [embed] });
	},
};
