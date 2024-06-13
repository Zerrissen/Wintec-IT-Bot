const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Allows a moderator to timeout a member of the server.")
    .addUserOption((option) => option.setName("user").setDescription("The user you want to timeout").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the timeout")
        .setRequired(true)
        .addChoices(
          { name: "60 Seconds", value: "60" },
          { name: "2 Minutes", value: "120" },
          { name: "5 Minutes", value: "300" },
          { name: "10 Minutes", value: "600" },
          { name: "15 Minutes", value: "900" },
          { name: "20 Minutes", value: "1200" },
          { name: "30 Minutes", value: "1800" },
          { name: "45 Minutes", value: "2700" },
          { name: "1 Hour", value: "3600" },
          { name: "2 Hours", value: "7200" },
          { name: "3 Hours", value: "10000" },
          { name: "5 Hours", value: "18000" },
          { name: "10 Hours", value: "36000" },
          { name: "1 Day", value: "86400" },
          { name: "2 Days", value: "172800" },
          { name: "3 Days", value: "259200" },
          { name: "5 Days", value: "432000" },
          { name: "1 Week", value: "604800" },
          { name: "2 Weeks", value: "1209600" },
          { name: "3 Weeks", value: "1814400" },
          { name: "1 Month", value: "2419200" }
        )
    )
    .addStringOption((option) => option.setName("reason").setDescription("The reason for giving the user a timeout")),
  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const targetMember = await interaction.guild.members.fetch(target.id);
    const duration = interaction.options.getString("duration");

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return await interaction.reply({
        content: "You must have the moderate members permission to use this command.",
      });
    }

    if (interaction.member.id == targetMember.id) {
      return await interaction.reply({
        content: "You cannot timeout yourself, silly!",
      });
    }

    if (!targetMember) {
      return await interaction.reply({
        content: "The user mentioned does not exist in this server.",
      });
    }

    if (!targetMember.kickable) {
      return await interaction.reply({
        content: "User cannot be timed out due to them having greater permissions.",
      });
    }

    if (targetMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await interaction.reply({
        content: "You cannot timeout a user with an Administrator role, silly!",
      });
    }

    let reason = interaction.options.getString("reason") || "No reason given.";
    await targetMember.timeout(duration * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor(0x0f4a00)
      .setDescription(
        `:white_check_mark:  Wee woo, @${target.username} has been **timed out** for ${duration / 60} minutes | ${reason}`
      );

    const dmEmbed = new EmbedBuilder()
      .setColor(0x0f4a00)
      .setDescription(
        `:white_check_mark:  Wee woo, you have been timed out in ${interaction.guild.name}. You can check the status of your timeout in the server | ${reason}`
      );

    await targetMember
      .send({ embeds: [dmEmbed] }) // Use the following catch for every time we call member.send. Unfortunately no other way around this. See https://discordjs.guide/popular-topics/errors.html#cannot-send-messages-to-this-user
      .catch((error) => {
        console.log(
          chalk.red(`[API] ${member.user.username} cannot be messaged. Not DMing! Error code: ${error.code}`)
        );
      });

    await interaction.reply({ embeds: [embed] });
  },
};
