const { Events } = require("discord.js");
const log = require("../../util/logger");
const { getGuild, upsertGuild } = require("../../db/guild");

module.exports = {
  name: Events.GuildCreate,
  once: false,
  async execute(guild) {
    log.info("Client", `Joined guild ${guild.id} (${guild.name})!`);
    const owner = await guild.fetchOwner();

    try {
      await upsertGuild({ guildId: guild.id, guildName: guild.name })
      log.success("Database", `Updated guild ${guild.id} (${guild.name}) in the database.`);
    } catch (err) {
      log.err("Client", `Error creating guild in database: ${err}`);
      owner.send(
        `I encountered an error while trying to save your server to my database. Please contact the bot owner in our (un)official server for assistance: https://discord.com/invite/CuYszeSGXf`
      );
    }

    //* Do a quick check to be super doubly sure the guild was created in the database
    const knownGuild = await getGuild(guild.id);
    if (!knownGuild) {
      log.err("Client", `Failed to fetch guild ${guild.id} (${guild.name}) from the database.`);
      owner.send(
        `I encountered an error while trying to retrieve your server from my database. \nPlease contact the bot owner in our (un)official server for assistance: https://discord.com/invite/CuYszeSGXf`
      );
      return;
    }

    owner.send(
      `Howdy ${owner.displayName}! Thanks for inviting me to your server!\nTo get started, use the \`/config\` command to configure the bot for your server. You can also use the \`/help\` command to see a list of available commands.\nIf you have any questions, feel free to join the (un)official server: https://discord.com/invite/CuYszeSGXf`
    );
  },
};
