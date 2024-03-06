const { Events } = require("discord.js");
const log = require("../../util/logger");
const { createUser, getUserById } = require("../../db/user");

module.exports = {
  name: Events.GuildMemberUpdate,
  //! Yes, oldMember is needed. Don't remove it.
  async execute(oldMember, member) {
    log.info("Client", `Member @${member.user.username} updated in guild ${member.guild.id} (${member.guild.name})`);

    //* Check if the user is in the database
    const user = await getUserById(member.id);
    if (user.verified === true && user.userRole != "Visitor") {
      log.info("Client", `@${member.user.username} verified!`);
      // If the user is in the database, see whether they are verified or not.
    } else if (user.verified === false && user.userRole != "Visitor") {
      log.info("Client", `@${member.user.username} not verified!`);
      member
        .send(
          "Hi! You've registered yourself as a Wintec student/alumni. Please run the /verify command in the #verify channel to get access to all the other student channels."
        )
        // Use the following catch for every time we call member.send. Unfortunately no other way around this. See https://discordjs.guide/popular-topics/errors.html#cannot-send-messages-to-this-user
        .catch((error) => {
          log.err("API", `Cannot send message to ${member.user.username}. Error code: ${error.code}`);
        });
    } else {
      log.info("Client", `@${member.user.username} is visitor`);
    }

    //* As nice as it would be to use the discord cache, it doesn't work as well with multiple servers. So we'll use the database instead.
    // if (member.roles.cache.some((role) => role.name === "Verified")) {
    //   log.success("Client", `@${member.user.username} verified!`);
    // } else if (
    //   member.roles.cache.some((role) => role.name === "Student") ||
    //   member.roles.cache.some((role) => role.name === "Alumni")
    // ) {
    //   log.info("Client", `@${member.user.username} not verified!`);
    //   member
    //     .send(
    //       "Hi! You've registered yourself as a Wintec student/alumni. Please run the /verify command in the #verify channel to get access to all the other student channels."
    //     )
    //     // Use the following catch for every time we call member.send. Unfortunately no other way around this. See https://discordjs.guide/popular-topics/errors.html#cannot-send-messages-to-this-user
    //     .catch((error) => {
    //       console.log(log.err("API", `Cannot send message to ${member.user.username}. Error code: ${error.code}`));
    //     });
    // } else {
    //   log.info("Client", `@${member.user.username} is visitor`);
    // }
  },
};
