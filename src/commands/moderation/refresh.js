// This command will begin a manual check for all users with the "Verified" and update their verified status in the database accordingly.

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUserById, upsertUser } = require("../../db/user");

module.exports = {
  data: new SlashCommandBuilder().setName("refresh").setDescription("Refreshes server verification system."),
  async execute(interaction) {
    // require server owner
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply("You must be the server owner to use this command.");
    }

    // fetch all members
    const members = await interaction.guild.members.fetch();

    // iterate over members and update their status in the database
    members.forEach(async (member) => {
      if (member.roles.cache.some((role) => role.name === "Verified")) {
        await upsertUser({ discordId: member.id, username: member.user.username, verified: true });
      } else {
        await upsertUser({ discordId: member.id, username: member.user.username, verified: false });
      }
    });

    const embed = new EmbedBuilder()
      .setColor(0x0f4a00)
      .setDescription(
        `:white_check_mark:  ${interaction.guild.memberCount} members have been refreshed in the database.`
      );

    await interaction.reply({ embeds: [embed] });
  },
};
