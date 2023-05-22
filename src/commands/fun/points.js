//slash command to get the amount of points a user has

// Import necessary modules from Discord.js library
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Gives the amount of points a user has!')
        .addUserOption((option) =>
            option.setName('target').setDescription('The users points to see')
        ),
    async execute(interaction, client) {
        const selectedUser =
            interaction.options.getUser('target') || interaction.user;
        const selectedUserId = selectedUser.id;

        const storedBalance = await Balance.findOne({
            userId: selectedUserId,
        });

        if (!storedBalance)
            return await interaction.reply({
                content: `@${selectedUser.username}, doesnt have a balance.`,
                ephemeral: true,
            });
        else {
            const userPoints = storedBalance.balance;

            const userLevel = String(
                Math.floor(Math.log2(userPoints / 10 + 1)) + 1
            );
            const totalPointsToNextLevel =
                10 * (Math.pow(2, parseInt(userLevel)) - 1);

            const reqXp = String(totalPointsToNextLevel - userPoints);

            const embed = new EmbedBuilder()
                .setTitle(`${selectedUser.username}'s Profile`)
                .setColor(0x02621c)
                .setThumbnail(`${selectedUser.displayAvatarURL()}`)
                .setDescription(
                    `This profile contains information about the user and their wizard points!`
                )
                .addFields(
                    {
                        name: 'Wizard Points',
                        value: `User has ${storedBalance.balance} points!`,
                        inline: true,
                    },
                    {
                        name: 'Tech Wizard Level',
                        value: userLevel,
                        inline: true,
                    },
                    {
                        name: 'Remaining Points To Next Level',
                        value: `${reqXp}`,
                        inline: false,
                    }
                )
                .setTimestamp();
            await interaction.reply({
                embeds: [embed],
            });
        }
    },
};
