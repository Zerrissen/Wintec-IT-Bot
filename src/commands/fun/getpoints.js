//slash command to get the amount of points a user has

// Import necessary modules from Discord.js library
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Gives the amount of points a user has!'),
    .addUserOption(option => option.setName('target').setDescription('The users points to see')
	async execute(interaction) {
		const selectedUser = interaction.options.getUser('target') || interaction.user;
		const storedBalance = await client.getBalance(selectedUser.id)
		
		if (!storedBalance) return await interaction.reply({
			content: `${selectedUser.tag}, doesnt have a balance.`,
			ephemeral: true
		});
		else {
			const embed = new EmbedBuilder()
				.setTitle(`${selectedUSer.username}'s Balance: `)
				.addFields([
				{
					name: `$${storedBalance.balance}`,
				}
			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};
