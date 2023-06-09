const { Events } = require("discord.js");

module.exports = {
	once: true,
	event: Events.ClientReady,

	async execute(client) {
		console.log(`Logged in as ${client.user.tag}.`);
	},
};
