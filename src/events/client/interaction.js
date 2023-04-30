const { Events } = require("discord.js");
const chalk = require("chalk");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) {
                return;
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.log(chalk.red(`[Command] Error occurred while executing command ${commandName}: \n${error}`));
                await interaction.reply({
                    content: `Uh oh! An error occurred while executing this command.\nPlease let a moderator know so we can get this fixed.`,
                    ephemeral: true,
                });
            }
        }
    },
};
