const {
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Allows a moderator to kick a member from the server.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to kick')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for kicking user')
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const targetMember = await interaction.guild.members.fetch(target.id);

        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.KickMembers
            )
        ) {
            return await interaction.reply({
                content:
                    'You must have the kick members permission to use this command.',
            });
        }

        if (interaction.member.id == target.id) {
            return await interaction.reply({
                content: 'You cannot kick yourself, dingus!',
            });
        }

        if (!targetMember) {
            return await interaction.reply({
                content: 'The user mentioned does not exist in this server.',
            });
        }

        if (!targetMember.kickable) {
            return await interaction.reply({
                content:
                    'User cannot be kicked due to them having greater permissions.',
            });
        }

        if (
            targetMember.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return await interaction.reply({
                content: 'You cannot kick a user with an Administrator role.',
            });
        }

        let reason =
            interaction.options.getString('reason') || 'No reason given.';

        targetMember.kick();

        const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  ${target.tag} has been **kicked** | ${reason}`
            );

        const dmEmbed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  You have been kicked from ${interaction.guild.name} | ${reason}`
            );

        await targetMember.send({ embeds: [dmEmbed] }).catch((err) => {
            return;
        });

        await interaction.reply({ embeds: [embed] });
    },
};
