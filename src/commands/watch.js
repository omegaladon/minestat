const { default: axios } = require("axios");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    admin: true,
    data: new SlashCommandBuilder()
        .setName('watch')
        .setDescription(`Send a message with a Minecraft server's information that gets updated periodically.`)
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

        const apiLink = `https://api.torch.tyruschuang.com/status/${type}/${ip}`;
        const data = await axios.get(apiLink).data;
        

    }
}