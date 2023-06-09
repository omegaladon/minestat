const { Events, PermissionsBitField } = require("discord.js");

module.exports = {
	once: false,
	event: Events.InteractionCreate,

	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(
			interaction.commandName
		);
		if (!command) return;

		if (command.admin) {
			if (
				!interaction.member.permissions.has(
					PermissionsBitField.Flags.Administrator
				)
			) {
				await interaction.reply({
					content: "You don't have permission to use this command!",
					ephemeral: true,
				});
				return;
			}
		}

		if (interaction.client.cooldowns.has(interaction.user.id)) {
			const expirationTime =
				interaction.client.cooldowns.get(interaction.user.id) + 5000;

			if (Date.now() < expirationTime) {
				const timeLeft = (expirationTime - Date.now()) / 1000;
				interaction.reply({
					content: `You need to wait ${timeLeft.toFixed(
						1
					)} more second(s) before using another command.`,
					ephemeral: true,
				});
				return;
			}
		}

		try {
			await command.execute(interaction);
			interaction.client.cooldowns.set(interaction.user.id, Date.now());
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	},
};
