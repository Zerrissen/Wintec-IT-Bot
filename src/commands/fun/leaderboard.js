// Slash command to display a leaderboard of wizard points
// Import necessary modules from Discord.js library
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Gives the amount of points a user has!'),
    async execute(interaction, client) {
        Balance.find()
        .sort({balance: -1})
        .limit(10)
        .then(leaderboard => {
            const embed = new EmbedBuilder()
                .setColor(0x0f4a00)
                .setTitle('Wizard Point Leaderboard');
            let position = 1;

            for (record of leaderboard) {
                const member = client.users.cache.get(record.userId);
                const memberName = member.username;
                embed.addFields({ name:`#${String(position)} @${memberName}`, value:`${String(record.balance)} points` })
                position++;
            }

            interaction.reply({ embeds: [embed]});

        });

    },
};
