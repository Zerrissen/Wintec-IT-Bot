const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Displays all commands."),
  async execute(interaction) {
    const client = interaction.client;
    const commandArray = client.commandArray;

    // Create an embed to display the help message
    const embed = new EmbedBuilder()
      .setColor(0x0f4a00)
      .setTitle("Commands")
      .setDescription("Here are all available commands:");

    // for (const command of commandArray) {
    //     embed.addFields({ name: command.name, value: command.description });
    // }

    // Categorize the commands by folders
    const categorizedCommands = {};
    for (const commandData of commandArray) {
      // We wanna capitalize the title of our folder!
      const folder = commandData.folder || "Uncategorized";
      const folderTitle = folder.charAt(0).toUpperCase() + folder.slice(1);
      if (!categorizedCommands[folderTitle]) {
        categorizedCommands[folderTitle] = [];
      }
      categorizedCommands[folderTitle].push(commandData);
    }

    // Add fields to the embed for each category
    for (const folderTitle in categorizedCommands) {
      const commands = categorizedCommands[folderTitle];
      const commandList = commands.map((cmd) => `/${cmd.name} - ${cmd.description}`).join("\n");
      embed.addFields({ name: folderTitle, value: commandList });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
