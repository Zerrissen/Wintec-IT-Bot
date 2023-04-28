const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong! and the roundtrip latency.'),
    async execute(interaction) {
        await interaction.reply(`Pong! Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`)
    }
}

