const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUserById } = require("../../db/user");

module.exports = {
  data: new SlashCommandBuilder().setName("user").setDescription("Provides information about the user."),
  async execute(interaction, client) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    const userProfile = getUserById(interaction.member.id);
    if (userProfile === null) {
      return interaction.reply("User not found.");
    }

    const embed = new EmbedBuilder()
      .setColor(0x0f4a00)
      .setDescription(`:white_check_mark:  User: @${userProfile.discordId} || User verified: ${userProfile.verified}!`);

    await interaction.reply({ embeds: [embed] });
  },
};
