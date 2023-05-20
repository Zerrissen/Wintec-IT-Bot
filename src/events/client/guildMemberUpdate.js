const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, member) { //! Yes, oldMember is needed. Don't remove it.
        console.log(
            chalk.cyan(
                `[Client] ${member.user.username} updated, checking for Student/Alumni..`
            )
        );

        if (member.roles.cache.some((role) => role.name === 'Verified')) {
            console.log(
                chalk.green(`[Client] ${member.user.username} verified!`)
            );
        } else if (
            member.roles.cache.some((role) => role.name === 'Student') ||
            member.roles.cache.some((role) => role.name === 'Alumni')
        ) {
            console.log(
                chalk.red(`[Client] ${member.user.username} not verified!`)
            );
            member.send(
                "Hi! You've registered yourself as a Wintec student/alumni. Please run the /verify command in the #verify channel to get access to all the other student channels."
            );
        } else {
            console.log(
                chalk.green(`[Client] ${member.user.username} is visitor`)
            );
        }
    },
};
