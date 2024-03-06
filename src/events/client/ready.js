const { Events } = require("discord.js");
const log = require("../../util/logger");
const { createGuild, getGuild, upsertGuild } = require("../../db/guild");
const { upsertUser } = require("../../db/user");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    log.success("Client", `Logged in as @${client.user.username}`);

    const guilds = client.guilds.cache.map((guild) => guild.id);
    for (const id of guilds) {
      const guild = await client.guilds.fetch(id);
      const members = await guild.members.fetch();
      const channels = await guild.channels.fetch();
      log.info("Client", `Cache for guild ${id} built!`);

      log.info("Client", `Fetching guild ${id} from database.`);
      try {
        // upsert guild, to make sure guild names are up to date
        const guildData = await getGuild(id);
        if (guildData === null) {
          await createGuild({ guildId: id, guildName: guild.name });
        } else {
          await upsertGuild({ guildId: id, guildName: guild.name });
        }
      } catch (e) {
        log.err("Client", `Failed to fetch guild ${id} from database.`, e);
      }
      log.success("Client", `Guild ${id} updated in database.`);


      log.info("Client", `Fetching members from guild ${id} and updating database.`);
      try {
        members.forEach(async (member) => {
          // upsert member into database
          await upsertUser({ discordId: member.id, username: member.user.username });
        });
      } catch (e) {
        log.err("Client", `Failed to fetch members from guild ${id} and update database.`, e);
      }
      log.success("Client", `Members from guild ${id} updated in database.`);
    }
  },
};
