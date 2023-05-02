const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all commands.'),
    async execute(interaction) {
        await interaction.reply(`Still in development!`);
    },
};
