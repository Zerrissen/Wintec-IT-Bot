const {
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Allows a moderator to ban a member from the server.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to ban')
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
                content: 'You cannot ban yourself, doofus!',
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
                    'User cannot be banned out due to them having greater permissions.',
            });
        }

        if (
            targetMember.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return await interaction.reply({
                content: 'You cannot ban a user with an Administrator role, doofus!',
            });
        }

        let reason =
            interaction.options.getString('reason') || 'No reason given.';

        targetMember.ban();

        const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  Wee woo, @${target.username} has been **banned** | ${reason}`
            );

        const dmEmbed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                `:white_check_mark:  Wee woo, you have been banned from ${interaction.guild.name}. | ${reason}`
            );

        await targetMember.send({ embeds: [dmEmbed] }).catch((err) => {
            return;
        });

        await interaction.reply({ embeds: [embed] });
    },
};
