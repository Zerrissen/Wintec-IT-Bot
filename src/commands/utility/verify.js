const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
} = require('discord.js');
const User = require('../../schemas/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Starts the user verification process.'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild

        const role = interaction.member.guild.roles.cache.find(
            (role) => role.name === 'Verified'
        );
        const filter = { userId: interaction.member.id };
        const update = {
            userId: interaction.member.id,
            userName: interaction.user.username,
            userVerified: interaction.member.roles.cache.some(
                (roleCheck) => roleCheck.name === 'Verified'
            ),
        };
        let userProfile = await User.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
        });

        if (userProfile.userVerified === true) {
            if (
                !interaction.member.roles.cache.some(
                    (roleCheck) => roleCheck.name === 'Verified'
                )
            ) {
                interaction.member.roles.add(role);
            }
            const embed = new EmbedBuilder()
                .setColor(0x0f4a00)
                .setDescription(
                    `:white_check_mark:  User: @${userProfile.userName} already verified!`
                );

            await interaction.reply({ embeds: [embed] });
        } else {
            const emailModal = new ModalBuilder()
                .setCustomId('verify-email')
                .setTitle('User Email');

            const emailTextInput = new TextInputBuilder()
                .setCustomId('verifyEmailInput')
                .setLabel('Enter your student email address')
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            emailModal.addComponents(
                new ActionRowBuilder().addComponents(emailTextInput)
            );

            await interaction.showModal(emailModal);
        }
    },
};
