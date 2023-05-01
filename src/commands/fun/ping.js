const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong! and the roundtrip latency."),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(`:arrows_counterclockwise:  **Pong!**`);

        await interaction.reply({ embeds: [embed] });

        embed.setDescription(
            `:white_check_mark:  **Pong!** ${
                Date.now() - interaction.createdTimestamp
            }ms`
        );
        await interaction.editReply({ embeds: [embed] });
    },
};
