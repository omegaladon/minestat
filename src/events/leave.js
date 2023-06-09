const { Events } = require("discord.js");

module.exports = {
	once: false,
	event: Events.GuildDelete,

	async execute(guild) {
		const database = guild.client.watcher.mongo.db("minestat");
		const collection = database.collection("watch");

        const guildId = guild.id;
        const deleted = await collection.deleteMany({ guildId: guildId });
	},
};
