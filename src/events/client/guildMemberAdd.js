const { Events } = require('discord.js');
const chalk = require('chalk');
const User = require('../../schemas/user');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        console.log(
            chalk.cyan(
                `[Client] Checking if ${member.user.username} is verified...`
            )
        );

        const filter = { userId: member.user.id };
        const update = {
            userId: member.user.id,
            userName: member.user.username,
        };
        let userProfile = User.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
        });

        if (userProfile.userVerified === true) {
            // Add role
            const role = interaction.member.guild.roles.cache.find(
                (role) => role.name === 'Verified'
            );
            interaction.member.roles.add(role);
            console.log(
                chalk.green(`[Client] @${member.user.username} verified!`)
            );

            member
                .send(
                    "Howdy! It seems you've rejoined the **Wintec IT Student** server. Welcome back! You don't have to verify again, just select the Student or Alumni role! Also, please don't forget to change your server nickname to your first name!"
                )
                // Use the following catch for every time we call member.send. Unfortunately no other way around this. See https://discordjs.guide/popular-topics/errors.html#cannot-send-messages-to-this-user
                .catch((error) => {
                    console.log(
                        chalk.red(
                            `[API] ${member.user.username} cannot be messaged. Not DMing! Error code: ${error.code}`
                        )
                    );
                });
        } else {
            console.log(
                chalk.red(`[Client] @${member.user.username} not verified!`)
            );
        }
    },
};
