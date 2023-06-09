const { default: axios } = require("axios");
const {
	AttachmentBuilder,
	EmbedBuilder,
	Message,
	ActivityType,
} = require("discord.js");
const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require("./config");

require("dotenv").config();
const URI = process.env.MONGO_URI;

const GUILD_ID = config.dev_guild_id;
const IMAGE_CHANNEL_ID = config.image_channel_id;

class Watcher {
	constructor(client) {
		this.mongo = new MongoClient(URI, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
		this.client = client;
	}

	async getAmount() {
		const database = this.mongo.db("minestat");
		const collection = database.collection("watch");
		try {
			return await collection.estimatedDocumentCount();
		} catch (err) {
			console.error(err);
		}
	}

	async getEmbed(ip, type, full) {
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
					text: `Watching ${
						type.charAt(0).toUpperCase() +
						type.substr(1).toLowerCase()
					} Server ${response.data.host}:${response.data.port}`,
				})
				.setTimestamp();
		} else {
			let iconUrl = this.client.iconCache.get(response.data.icon);
			if (!iconUrl) {
				const buffer = Buffer.from(
					response.data.icon.split(",")[1],
					"base64"
				);
				const attachment = new AttachmentBuilder(buffer, "icon.png");
				const message = await this.client.guilds.cache
					.get(GUILD_ID)
					.channels.cache.get(IMAGE_CHANNEL_ID)
					.send({ files: [attachment] });
				iconUrl = message.attachments.first().url;
				this.client.iconCache.set(response.data.icon, iconUrl, 1200);
			}

			if (full) {
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
						text: `Watching ${
							type.charAt(0).toUpperCase() +
							type.substr(1).toLowerCase()
						} Server ${response.data.host}:${response.data.port}`,
					})
					.setTimestamp()
					.setThumbnail(iconUrl);
			} else {
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
						name: `Players`,
						value: `${response.data.players.online} / ${response.data.players.max}`,
						inline: false,
					},
				];

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
						text: `Watching ${
							type.charAt(0).toUpperCase() +
							type.substr(1).toLowerCase()
						} Server ${response.data.host}:${response.data.port}`,
					})
					.setTimestamp()
					.setThumbnail(iconUrl);
			}
		}

		return embed;
	}

	async editMessage(guildId, channelId, messageId, ip, type, full) {
		const embed = await this.getEmbed(ip, type, full);
		try {
			const msg = await this.client.guilds.cache
				.get(guildId)
				.channels.cache.get(channelId)
				.messages.fetch(messageId);
			await msg.edit({ embeds: [embed] });
		} catch (err) {
			if (err.code === 10008) {
				console.log("Message not found");
				const database = this.mongo.db("minestat");
				const collection = database.collection("watch");
				try {
					await collection.deleteOne({ messageId });
				} catch (err) {
					console.error(err);
				}
			}
		}
	}

	async update() {
		this.client.user.setPresence({
			activities: [
				{
					name: `${await this.getAmount()} MC servers`,
					type: ActivityType.Watching,
				},
			],
			status: "online",
		});
		try {
			const database = this.mongo.db("minestat");
			const collection = database.collection("watch");
			const documents = await collection.find({}).toArray();
			for (const document of documents) {
				const { guildId, channelId, messageId, ip, type, full } =
					document;
				this.editMessage(guildId, channelId, messageId, ip, type, full);
			}
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = Watcher;
