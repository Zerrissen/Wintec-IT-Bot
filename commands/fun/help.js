const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('Help')
        .setDescription('Replies with Help'),
    async execute(interaction) {
        await interaction.reply('Hello here are the current avalible commands. ping')
    }
}
