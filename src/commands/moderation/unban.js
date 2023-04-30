const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Allows a moderator to unban a member from the server.")
        .addUserOption(option => option.setName('user').setDescription('The user you want to unban').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const targetMember = await interaction.guild.members.fetch(target.id);
        guild.members.unban(targetMember);

        const embed = new EmbedBuilder()
        .setColor(0x0f4a00)
        .setDescription(`:white_check_mark:  ${target.tag} has been **unbanned**`)

        const dmEmbed = new EmbedBuilder()
        .setColor(0x0f4a00)
        .setDescription(`:white_check_mark:  You have been unbanned from ${interaction.guild.name}`)

        await targetMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await interaction.reply({ embeds: [embed] });

        },
};
