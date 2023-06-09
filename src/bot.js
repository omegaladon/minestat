const fs = require("node:fs");
const path = require("node:path");
const {
	Client,
	GatewayIntentBits,
	Events,
	REST,
	Routes,
	Collection,
} = require("discord.js");
const NodeCache = require("node-cache");
const config = require("./config");
const Watcher = require("./watcher");

require("dotenv").config();
const GUILD_ID = config.dev_guild_id;
const BOT_ID = config.bot_id;

class Bot {
	constructor(token, mode) {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
			],
		});
		this.client.token = token;
		this.client.mode = mode;
		this.client.commands = new Collection();
		this.client.cooldowns = new Collection();

		this.client.iconCache = new NodeCache();

		this.client.watcher = new Watcher(this.client);
		setInterval(async () => {
			await this.client.watcher.update();
		}, 3000);
	}

	registerCommands() {
		const commands = [];

		const commandsPath = path.join(__dirname, "commands");
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			const command = require(`${commandsPath}/${file}`);
			if ("data" in command && "execute" in command) {
				commands.push(command.data.toJSON());
				this.client.commands.set(command.data.name, command);
			} else {
				console.error(`Command in file ${file} is not valid.`);
			}
		}

		const rest = new REST().setToken(this.client.token);
		(async () => {
			try {
				console.log(
					`Started refreshing ${commands.length} slash commands.`
				);
				const data =
					this.client.mode === "dev"
						? await rest.put(
								Routes.applicationGuildCommands(
									BOT_ID,
									GUILD_ID
								),
								{ body: commands }
						  )
						: await rest.put(Routes.applicationCommands(BOT_ID), {
								body: commands,
						  });
				console.log(
					`Successfully reloaded ${data.length} slash commands.`
				);
			} catch (error) {
				console.error(error);
			}
		})();
	}

	registerEvents() {
		const eventPath = path.join(__dirname, "events");
		const eventFiles = fs
			.readdirSync(eventPath)
			.filter((file) => file.endsWith(".js"));
		for (const file of eventFiles) {
			const event = require(`${eventPath}/${file}`);
			if ("once" in event && "event" in event && "execute" in event) {
				if (event.once) {
					this.client.once(event.event, async (...args) =>
						event.execute(...args)
					);
				} else {
					this.client.on(event.event, async (...args) =>
						event.execute(...args)
					);
				}
			} else {
				console.error(`Command in file ${file} is not valid.`);
			}
		}
	}

	login() {
		this.client.login(this.client.token);
	}

	destroy() {
		this.client.destroy();
	}
}

module.exports = Bot;
