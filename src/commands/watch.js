const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	admin: true,
	data: new SlashCommandBuilder()
		.setName("watch")
		.setDescription(
			`Send a message with a Minecraft server's information that gets updated periodically.`
		)
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
		)
		.addBooleanOption((option) =>
			option
				.setName("full")
				.setDescription("Whether to show all Minecraft server data.")
				.setRequired(false)
		),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const ip = interaction.options.getString("ip");
		const type = interaction.options.getString("type") || "java";
		const full = interaction.options.getBoolean("full") || false;


		
		const database = interaction.client.watcher.mongo.db("minestat");
		const collection = database.collection("watch");
		
		const guildId = interaction.guild.id;
		if (await collection.countDocuments({ guildId: guildId }) >= 4) {
			return interaction.editReply({
				content: `You can only watch up to \`4\` servers in \`1\` guild at a time.`,
			});
		}

		if (await collection.countDocuments({ guildId: guildId, ip: ip, type: type }) >= 1) {
			return interaction.editReply({
				content: `You are already watching \`${ip}\`! To unwatch, use the \`/unwatch\` command.`,
			});
		}

		const embed = await interaction.client.watcher.getEmbed(ip, type, full);
		const message = await interaction.channel.send({ embeds: [embed] });

		const channelId = interaction.channel.id;
		const messageId = message.id;

		const result = await collection.insertOne({
			guildId: guildId,
			channelId: channelId,
			messageId: messageId,
			ip: ip,
			type: type,
			full: full,
		});
		interaction.editReply({
			content: `Successfully started watching \`${ip}\`!`,
		});
		
	},
};
