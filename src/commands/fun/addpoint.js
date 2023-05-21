//slash command to add 1 wizard point to a users record in the database

// Import necessary modules from Discord.js library
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wizard')
		.setDescription('Gives a user a wizard point!'),
	async execute(interaction) {
		await interaction.reply('Gave user a point!');
	},
};
