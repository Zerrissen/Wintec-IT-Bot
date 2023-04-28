const { REST } = require('@discordjs/rest');
const { Routes} = require('discord-api-types/v9');
const chalk = require('chalk');
const fs = require('node:fs')

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./src/commands');
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                if ('data' in command && 'execute' in command) {
                    commands.set(command.data.name, command);
                    commandArray.push(command.data.toJSON());
                } else {
                    console.log(chalk.red(`[Command] The command at ${$folder}/${file} is missing a required "data" or "execute" property. Skipping command.`))
                }
            }
        }

        const clientID = process.env.CLIENT_ID;
        const guildId = process.env.GUILD_ID;
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
        try {
            console.log(chalk.cyan('[Command] Started refreshing slash (/) commands...'))

            await rest.put(Routes.applicationGuildCommands(clientID, guildId), {
                body: client.commandArray
            });
        } catch (error) {
            console.error(error)
        } finally {
            console.log(chalk.green('[Command] Slash (/) commands successfully registered'))
        }

    }
}