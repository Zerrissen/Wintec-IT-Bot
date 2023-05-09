// Import necessary modules from Discord.js library
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ping = require("ping"); // Import ping library

// Export object that contains command data and execute function
module.exports = {
  // Define command data using SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pings a specified URL and returns the response time.")
    .addStringOption((option) => option.setName("url").setDescription("The URL to ping.").setRequired(true)),

  // Define execute function that runs when command is triggered
  async execute(interaction) {
    const url = interaction.options.getString("url"); // Get URL parameter

    // Create new EmbedBuilder instance with green color and ping result message
    const embed = new EmbedBuilder()
      .setColor(0x0f4a00)
      .setDescription(`:arrows_counterclockwise:  **Pinging ${url}...**`);

      await interaction.reply({ embeds: [embed] });

      const res = await ping.promise.probe(url); // Ping the URL using the ping library
      const responseTime = res.time; // Get the response time from the ping response

      embed.setDescription(`:white_check_mark:  **Ping result for ${url}:**\nResponse time: ${responseTime} ms`);

    // Send reply to user with embed object
    await interaction.editReply({ embeds: [embed] });
  },
};
