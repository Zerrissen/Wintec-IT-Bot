const { Events } = require("discord.js");
const { createUser, getUserById } = require("../../db/user");
const log = require("../../util/logger");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    log.info("Client", `Member @${member.user.username} joined guild ${member.guild.id} (${member.guild.name})`);

    // Check if user is verified, or create a new user if they don't exist
    if (getUserById(member.user.id) === null) {
      await createUser((discordId = member.user.id), (username = member.user.username));
    }

    const userProfile = await getUserById(member.user.id);

    if (userProfile.verified === true) {
      // Add role
      const role = interaction.member.guild.roles.cache.find((role) => role.name === "Verified");
      interaction.member.roles.add(role);
      log.success("Client", `@${member.user.username} verified!`);

      member
        .send(
          "Howdy! It seems you've rejoined the **Wintec IT Student** server. Welcome back! You don't have to verify again, just select the Student or Alumni role! Also, please don't forget to change your server nickname to your first name!"
        )
        // Use the following catch for every time we call member.send. Unfortunately no other way around this. See https://discordjs.guide/popular-topics/errors.html#cannot-send-messages-to-this-user
        .catch((error) => {
          log.err("API", `Cannot send message to ${member.user.username}. Error code: ${error.code}`);
        });
    } else {
      log.err("Client", `@${member.user.username} not verified!`);
    }
  },
};
