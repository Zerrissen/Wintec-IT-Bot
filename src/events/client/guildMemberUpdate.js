const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(member) {
        console.log(chalk.cyan(`[Client] ${member.user.username} updated, checking for Student/Alumni..`));

        if (interaction.member.roles.cache.some(
            (role) => role.name === 'Verified')) {
            console.log(chalk.green(`[Client] ${member.user.username} verified!`));
        } else {
            console.log(chalk.red(`[Client] ${member.user.username} not verified!`));
            member.send("Hi! You've registered yourself as a Wintec student/alumni. Please run the /verify command in the #verify channel to get access to all the other student channels.")
        }
    },
};
