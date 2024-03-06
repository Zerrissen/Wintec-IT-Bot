// This command will initiate the server configuration.
// Then, we will ask the user whether they wish to use the verification system with a button interaction. If yes, we will create a channel called "verify" and remember its ID.

const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const { upsertGuild } = require("../../db/guild");
const log = require("../../util/logger");

module.exports = {
  data: new SlashCommandBuilder().setName("config").setDescription("Configures the server."),
  async makeRole(interaction, roleName) {
    await interaction.guild.roles.create({
      name: roleName,
      reason: "Created for Wintec Bot verification system.",
    });
  },
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await interaction.reply({
        content: "You do not have the required permissions (Administrator) to run this command.",
      });
    }

    // Use embed with buttons to ask the user whether they want to use the verification system
    const embed = new EmbedBuilder()
      .setColor(0x0f4a00)
      .setTitle("Server Configuration")
      .setDescription("Do you want to use the verification system?");
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("yes").setLabel("Yes").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("no").setLabel("No").setStyle(ButtonStyle.Danger)
    );

    const response = await interaction.reply({ embeds: [embed], components: [row] });
    const collectorFilter = (i) => i.user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
      if (confirmation.customId === "yes") {
        let verifiedRole = interaction.guild.roles.cache.find((role) => role.name === "Verified");
        let visitorRole = interaction.guild.roles.cache.find((role) => role.name === "Visitor");
        let studentRole = interaction.guild.roles.cache.find((role) => role.name === "Student");
        let alumniRole = interaction.guild.roles.cache.find((role) => role.name === "Alumni");

        let botRole = interaction.guild.roles.cache.find((role) => role.name === client.user.username);
        // good lord this is horrific but it works and i cba refactoring it
        if (!verifiedRole) {
          this.makeRole(interaction, "Verified");
        } 
        else if (verifiedRole.comparePositionTo(botRole) >= 1) {
          interaction.channel.send(
            "The bots role is not high enough to manage the Verified role. Please move the bots role higher than the Verified role."
          );
        }
        if (!visitorRole) {
          this.makeRole(interaction, "Visitor");
        }

        if (!studentRole) {
          this.makeRole(interaction, "Student");
        }

        if (!alumniRole) {
          this.makeRole(interaction, "Alumni");
        }

        // check if channel exists already in discord
        let channel = interaction.guild.channels.cache.find((channel) => channel.name === "verify");
        if (!channel) {
          let newChannel = await interaction.guild.channels.create({
            name: "verify",
            type: ChannelType.GuildText,
          });

          await upsertGuild({ guildId: interaction.guild.id, usingVerify: true, verifyChannel: newChannel.id });
        } else {
          await upsertGuild({ guildId: interaction.guild.id, usingVerify: true, verifyChannel: channel.id });
        }

        embed.setDescription(
          ":white_check_mark: Server configuration complete! Please use the #verify channel for user verification. For any channel you don't want unverified users to see, update channel permissions accordingly."
        );
        embed.setFooter({ text: "Please note that the cross-server verification system is a work in progress." });
        await interaction.editReply({ embeds: [embed], components: [] });
      } else {
        await upsertGuild({ guildId: interaction.guild.id, usingVerify: false });
        embed.setDescription(":white_check_mark: Server configuration complete!");
        embed.setFooter({ text: "Please note that the cross-server verification system is a work in progress." });
        await interaction.editReply({ embeds: [embed], components: [] });
      }
    } catch (e) {
      embed.setDescription(":x: Server configuration timed out.");
      embed.setColor(0x9c0b0b);
      await interaction.editReply({ embeds: [embed], components: [] });
      log.err("Command", "Config command timed out.", e);
    }
  },
};
