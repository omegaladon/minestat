const { default: axios } = require("axios");
const { SlashCommandBuilder } = require("discord.js");

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
        console.log(response);
    }
};
