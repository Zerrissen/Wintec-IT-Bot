const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(chalk.green(`[Client] Logged in as @${client.user.username}`));

        const guilds = client.guilds.cache.map(guild => guild.id);
        for (const id of guilds) {
            const guild = await client.guilds.fetch(id);
            const members = await guild.members.fetch();
            console.log(chalk.green(`[Cache] Cache for guild ${id} built!`));
        }
    },
};
