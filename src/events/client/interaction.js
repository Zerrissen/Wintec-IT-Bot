const { Events, InteractionType } = require("discord.js");
const log = require("../../util/logger");

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
        log.info(
          "Client",
          `Command "${commandName}" executed by @${interaction.user.username} in guild ${interaction.guild.id} (${interaction.guild.name})`
        );
      } catch (error) {
        log.err("Client", `Error occurred while executing command ${commandName}: \n${error}`);
        await interaction.reply({
          content: `Uh oh! An error occurred while executing this command.\nPlease let a moderator know so we can get this fixed.`,
          ephemeral: true,
        });
      }
    } else if (interaction.isModalSubmit() || interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return new Error("No code for modal");

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        log.err("Client", error);
      }
    }
  },
};
