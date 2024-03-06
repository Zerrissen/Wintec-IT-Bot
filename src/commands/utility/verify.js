const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");
const { getUserById } = require("../../db/user");
const log = require("../../util/logger");

module.exports = {
  data: new SlashCommandBuilder().setName("verify").setDescription("Starts the user verification process."),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild

    const role = interaction.member.guild.roles.cache.find((role) => role.name === "Verified");
    const userProfile = await getUserById(interaction.member.id);

    if (userProfile.verified === true && userProfile.email !== null) {
      interaction.member.roles.add(role).catch((error) => {
        log.err("API", "Error adding role to user.", error);
        interaction.channel.send(
          "The bots role is not high enough to manage the Verified role. Please move the bots role higher than the Verified role."
        );
      });

      const embed = new EmbedBuilder()
        .setColor(0x0f4a00)
        .setDescription(`:white_check_mark:  User: @${userProfile.username} already verified!`);

      await interaction.reply({ embeds: [embed] });
    } else {
      const emailModal = new ModalBuilder().setCustomId("verify-email").setTitle("User Email");

      const emailTextInput = new TextInputBuilder()
        .setCustomId("verifyEmailInput")
        .setLabel("Enter your student email address")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      emailModal.addComponents(new ActionRowBuilder().addComponents(emailTextInput));

      await interaction.showModal(emailModal);
    }
  },
};
