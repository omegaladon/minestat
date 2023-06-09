const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	admin: true,
	data: new SlashCommandBuilder()
		.setName("list")
		.setDescription(
			`List all Minecraft servers that are being watched in this guild.`
		),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const database = interaction.client.watcher.mongo.db("minestat");
		const collection = database.collection("watch");

		const guildId = interaction.guild.id;
		if ((await collection.countDocuments({ guildId: guildId })) <= 0) {
			return interaction.editReply({
				content: `There are no servers being watched in this guild.`,
			});
		}

		const documents = await collection.find({ guildId: guildId }).toArray();

		const fields = [];

		for (const document of documents) {
			const { channelId, messageId, ip, type, full } = document;
			const messageLink = `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
			fields.push({
				name: `${messageLink}`,
				value: `IP: \`${ip}\`\nType: \`${
					type.charAt(0).toUpperCase() + type.substr(1).toLowerCase()
				}\`\nFull: \`${full}\``,
				inline: true,
			});
		}

		const embed = new EmbedBuilder()
			.setColor("Blue")
			.setAuthor({
				name: "Powered by the Torch API",
				iconURL: "https://torch.tyruschuang.com/logo.png",
				url: "https://torch.tyruschuang.com/api",
			})
			.setTitle(`📜 Watched Servers`)
			.setFooter({
				text: "Watched Servers List",
			})
			.setDescription(
				`Below is a list of all Minecraft servers that are being watched in this guild, along with a link to their respective message.`
			)
			.addFields(fields)
			.setTimestamp();

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
