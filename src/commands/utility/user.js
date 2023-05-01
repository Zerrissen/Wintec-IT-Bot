const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Provides information about the user."),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  Command run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}!`
            );

        await interaction.reply({ embeds: [embed] });
    },
};
