const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong! and the roundtrip latency."),
    async execute(interaction) {
        const msg = await interaction.reply(`Pong!`);
        await interaction.editReply({ content: `Pong! ${Date.now() - interaction.createdTimestamp}ms`})
        },
};
