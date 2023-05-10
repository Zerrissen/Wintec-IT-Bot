const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get information about a command')
		.addStringOption(option =>
			option.setName('commands')
				.setDescription('commands')
				.setRequired(true)
				.addChoices(
					{ name: 'ban', value: 'bans user of choice' },
					{ name: 'ping', value: 'replies pong' },
					{ name: 'verify', value: 'get your roles' },
				)),
	async execute(interaction) {
		await interaction.reply.options.getString(<optionName>)
        	ephemeral: true;
	},
};

