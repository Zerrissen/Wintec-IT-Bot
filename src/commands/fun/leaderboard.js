// Slash command to display a leaderboard of wizard points
// Import necessary modules from Discord.js library
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const chalk = require("chalk");
const Balance = require("../../schemas/balance");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Displays the top 10 users with wizard points!"),
    async execute(interaction) {
        Balance.find()
            .sort({ balance: -1 })
            .limit(20)
            .then(async (leaderboard) => {
                const embed = new EmbedBuilder()
                    .setColor(0x0f4a00)
                    .setTitle("Wizard Point Leaderboard");
                let position = 0;
                let counter = 0;

                while (counter <= 10) {
                    const member = await interaction.guild.members
                        .fetch(leaderboard.record.userId)
                        .catch((error) => {
                            console.log(
                                chalk.red(
                                    `[API] Cannot fetch user ID ${record.userID}! No longer in server. Error code: ${error.code}`
                                )
                            );
                        });

                    const memberName = member?.user?.username || 'Unknown User';
                    if (memberName != 'Unknown User') {
                        embed.addFields({
                            name: `#${String(position)} @${memberName}`,
                            value: `${String(record.balance)} points`,
                        });
                        counter++;
                    }
                }



                // for (record of leaderboard) {
                //     const member = await interaction.guild.members
                //         .fetch(record.userId)
                //         .catch((error) => {
                //             console.log(
                //                 chalk.red(
                //                     `[API] Cannot fetch user ID ${record.userID}! No longer in server. Error code: ${error.code}`
                //                 )
                //             );
                //         });
                //     // make sure user is still in server
                //     const memberName = member?.user?.username || 'Unknown User';
                //     if (memberName != 'Unknown User') {
                //         embed.addFields({
                //             name: `#${String(position)} @${memberName}`,
                //             value: `${String(record.balance)} points`,
                //         });
                //         position++;
                //     }
                // }

                interaction.reply({ embeds: [embed] });
            });
    },
};
