const { default: axios } = require("axios");
const { SlashCommandBuilder } = require("discord.js");

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
        console.log(response);

        // Offline server
        if (response.data.offline) {
            await interaction.editReply('Offline!');
        } else {

        }
    }
};
