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
                let position = 0; //Whenever a valid user is found, position is +1 and used in embed
                let counter = 0; //Whenever any user is found, the counter for the loop goes up by one


                //counter < leaderboard.length prevents reading past the number of entrees that exist
                //position <= 10 caps the leaderboard at 10 spots

                while (position <= 10 && counter < leaderboard.length) { //counter < leaderboard.length prevents reading past the number of entrees that exist
                    let record = leaderboard[counter] //The users information inside the database is stored in variable 'record'
                    const member = await interaction.guild.members
                        .fetch(record.userId) //.fetch grabs the information userId stored inside record to use in output
                        .catch((error) => {
                            console.log(
                                chalk.red(
                                    `[API] Cannot fetch user ID ${record.userID}! No longer in server. Error code: ${error.code}`
                                )
                            );
                        });
                    
                    
                    const memberName = member?.user?.username || 'Unknown User'; //Retrives user information
                    if (memberName != 'Unknown User') { //If the user is a vaild current user, they get added to the leaderboard
                        position++; //Makes their position one after the last valid user
                        embed.addFields({
                            name: `#${String(position)} @${memberName}`,
                            value: `${String(record.balance)} points`,
                        }); 
                    }
                    counter++; //Adds 1 to counter so the loop will go to the next user
                }
                interaction.reply({ embeds: [embed] }); //Sends the message to the server
            });
    },
};