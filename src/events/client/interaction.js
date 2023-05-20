const { Events, InteractionType } = require('discord.js');
const chalk = require('chalk');

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
                console.log(
                    chalk.green(
                        `[Command] "${commandName}" executed by ${interaction.user.username}`
                    )
                );
            } catch (error) {
                console.log(
                    chalk.red(
                        `[Command] Error occurred while executing command ${commandName}: \n${error}`
                    )
                );
                await interaction.reply({
                    content: `Uh oh! An error occurred while executing this command.\nPlease let a moderator know so we can get this fixed.`,
                    ephemeral: true,
                });
            }
        } else if (
            interaction.isModalSubmit() ||
            interaction.type == InteractionType.ModalSubmit
        ) {
            const { modals } = client;
            const { customId } = interaction;
            const modal = modals.get(customId);
            if (!modal) return new Error('No code for modal');

            try {
                await modal.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }
    },
};
