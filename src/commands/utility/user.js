const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.'),
    async execute(interaction, client) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        const filter = { userId: interaction.member.id };
        const update = {
            userId: interaction.member.id,
            userName: interaction.user.username,
            userVerified: interaction.member.roles.cache.some(
                (role) => role.name === 'Verified'
            ),
        };
        let userProfile = await User.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
        });

        const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  User: @${userProfile.userName} || User verified: ${userProfile.userVerified}!`
            );

        await interaction.reply({ embeds: [embed] });
    },
};
