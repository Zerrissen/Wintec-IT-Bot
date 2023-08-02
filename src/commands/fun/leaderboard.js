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

              
                while (counter <= 10 && counter < leaderboard.length) {
                    let record = leaderboard[counter]
                    console.log("leadercounter" + leaderboard[counter])
                    console.log("record.userId" + record.userId + "\n")
                    const member = await interaction.guild.members
                        .fetch(record.userId)
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
                            name: `#${String(counter)} @${memberName}`,
                            value: `${String(record.balance)} points`,
                        });
                        
                    }
                    counter++;
                }


                interaction.reply({ embeds: [embed] });
                
            });
    },
};

// // Import necessary modules from Discord.js library
// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const chalk = require("chalk");
// const Balance = require("../../schemas/balance"); // Import the Balance schema for accessing the database

// module.exports = {
//     // Create a new slash command with the name "leaderboard" and description "Gives the amount of points a user has!"
//     data: new SlashCommandBuilder()
//         .setName("leaderboard")
//         .setDescription("Gives the amount of points a user has!"),

//     // The execute function is called when the "leaderboard" command is triggered
//     async execute(interaction) {
//         // Fetch the top 10 records from the Balance collection, sorted by balance in descending order
//         Balance.find()
//             .sort({ balance: -1 })
//             .limit(10)
//             .then(async (leaderboard) => {
//                 // Create a new embed message to display the leaderboard
//                 const embed = new EmbedBuilder()
//                     .setColor(0x0f4a00)
//                     .setTitle("Wizard Point Leaderboard");

//                 let position = 1; // Initialize a position counter for ranking

//                 // Loop through the leaderboard records and fetch the associated member from the guild
//                 for (record of leaderboard) {
//                     const member = await interaction.guild.members
//                         .fetch(record.userId)
//                         .catch((error) => {
//                             // If the user is no longer in the server, handle the error
//                             console.log(
//                                 chalk.red(
//                                     `[API] Cannot fetch user ID ${record.userID}! No longer in server. Error code: ${error.code}`
//                                 )
//                             );
//                         });

//                     // Make sure user is still in the server and get the member's username
//                     const memberName = member?.user?.username || 'Unknown User';

//                     // Check if the member is not an "Unknown User"
//                     if (memberName != 'Unknown User') {
//                         // Add the member's username and balance to the embed message
//                         embed.addFields({
//                             name: `#${String(position)} @${memberName}`,
//                             value: `${String(record.balance)} points`,
//                         });
//                         position++; // Increment the position for the next member
//                     }
//                 }

//                 // Send the embed message containing the leaderboard to the interaction channel
//                 interaction.reply({ embeds: [embed] });
//             });
//     },
// };
