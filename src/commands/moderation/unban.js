const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Allows a moderator to unban a member from the server.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to unban')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const targetMember = await interaction.guild.members.fetch(target.id);

        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.BanMembers
            )
        ) {
            return await interaction.reply({
                content:
                    'You must have the ban members permission to use this command.',
            });
        }

        if (interaction.member.id == target.id) {
            return await interaction.reply({
                content: 'You cannot unban yourself, dummy!',
            });
        }

        if (!targetMember) {
            return await interaction.reply({
                content: 'The user mentioned does not exist in this server.',
            });
        }

        unban(target.id);

        const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  Woohoo! @${target.username} has been **unbanned**`
            );

        const dmEmbed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  Woohoo! You have been unbanned from ${interaction.guild.name}`
            );

        await targetMember.send({ embeds: [dmEmbed] }).catch((err) => {
            return;
        });

        await interaction.reply({ embeds: [embed] });
    },
};
