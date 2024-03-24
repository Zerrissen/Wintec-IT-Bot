//slash command to get the amount of points a user has

// Import necessary modules from Discord.js library
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getUserById } = require("../../db/user");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Gives the amount of points a user has!")
    .addUserOption((option) => option.setName("target").setDescription("The users points to see")),
  async execute(interaction, client) {
    const selectedUser = interaction.options.getUser("target") || interaction.user;
    const selectedUserId = selectedUser.id;

    const userProfile = getUserById(selectedUserId);
    if (userProfile === null) {
      return await interaction.reply({
        content: `@${selectedUser.username}, doesn't exist.`,
        ephemeral: true,
      });
    } else {
      const userPoints = userProfile.wizardPoints || 0;
      const userLevel = String(Math.floor(Math.log2(userPoints / 10 + 1)) + 1) || 1;
      const totalPointsToNextLevel = 10 * (Math.pow(2, parseInt(userLevel)) - 1);

      const reqXp = String(totalPointsToNextLevel - userPoints);

      const embed = new EmbedBuilder()
        .setTitle(`${selectedUser.username}'s Profile`)
        .setColor(0x02621c)
        .setThumbnail(`${selectedUser.displayAvatarURL()}`)
        .setDescription(`This profile contains information about the user and their wizard points!`)
        .addFields(
          {
            name: "Wizard Points",
            value: `User has ${userPoints} points!`,
            inline: true,
          },
          {
            name: "Tech Wizard Level",
            value: userLevel,
            inline: true,
          },
          {
            name: "Remaining Points To Next Level",
            value: reqXp,
            inline: false,
          }
        )
        .setTimestamp();
      await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
