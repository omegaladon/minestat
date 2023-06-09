const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	admin: true,
	data: new SlashCommandBuilder()
		.setName("unwatch")
		.setDescription(`Stop watching a Minecraft server.`)
		.addStringOption((option) =>
			option
				.setName("ip")
				.setDescription(
					`The IP of the server. "All" will stop watching all servers.`
				)
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
		await interaction.deferReply({ ephemeral: true });
		const ip = interaction.options.getString("ip");
		const type = interaction.options.getString("type") || "java";

		const database = interaction.client.watcher.mongo.db("minestat");
		const collection = database.collection("watch");

		if (ip.toLowerCase() === "all") {
			const guildId = interaction.guild.id;

			const documents = await collection
				.find({ guildId: guildId })
				.toArray();
			for (const document of documents) {
				const { channelId, messageId } = document;
				const message = await interaction.client.channels.cache
					.get(channelId)
					.messages.fetch(messageId);
				try {
					await message.delete();
				} catch (err) {
					console.log(err);
				}
			}

			const deleted = await collection.deleteMany({ guildId: guildId });
			return interaction.editReply({
				content: `Successfully stopped watching all servers!`,
			});
		} else {
			const guildId = interaction.guild.id;
			const document = await collection.findOne({
				guildId: guildId,
				ip: ip,
				type: type,
			});
			if (!document) {
				return interaction.editReply({
					content: `You are not watching \`${ip}\`! To watch a server, use the \`/watch\` command.`,
				});
			}
			const { channelId, messageId } = document;
			const message = await interaction.client.channels.cache
				.get(channelId)
				.messages.fetch(messageId);
			try {
				await message.delete();
			} catch (err) {
				console.log(err);
			}
			const deleted = await collection.deleteOne({
				guildId: guildId,
				ip: ip,
				type: type,
			});
			if (deleted.deletedCount === 0) {
				return interaction.editReply({
					content: `You are not watching \`${ip}\`! To watch a server, use the \`/watch\` command.`,
				});
			} else {
				return interaction.editReply({
					content: `Successfully stopped watching \`${ip}\`!`,
				});
			}
		}
	},
};
