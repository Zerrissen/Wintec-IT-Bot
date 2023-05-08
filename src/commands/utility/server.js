const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  **The ${interaction.guild.name} server has ${interaction.guild.memberCount} members! Yippee!**`
            );

        await interaction.reply({ embeds: [embed] });
    },
};
