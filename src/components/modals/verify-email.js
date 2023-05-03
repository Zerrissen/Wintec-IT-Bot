const nodemailer = require('nodemailer');
const { EmbedBuilder } = require('discord.js');
const User = require('../../schemas/user');

module.exports = {
    data: {
        name: 'verify-email',
    },
    async execute(interaction) {
        let regex = /[A-Za-z0-9]+@student\.wintec\.ac\.nz/i;
        if (!regex.test(interaction.fields.getTextInputValue('verifyEmailInput'))) {
            const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                ':x:  Please provide a student wintec email address, or contact a moderator.'
            );

            await interaction.reply({ embeds: [embed] });
            return;
        };
        const embed = new EmbedBuilder()
            .setColor(0x0f4a00)
            .setDescription(
                ':arrows_counterclockwise:  Generating code & sending email..'
            );

        await interaction.reply({ embeds: [embed] });

        let verifCode =
            Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        let mailTransporter = nodemailer.createTransport({
            host: 'smtp.zoho.com.au',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let details = {
            from: 'bot@itstudenthelp.com',
            to: interaction.fields.getTextInputValue('verifyEmailInput'),
            subject: 'Student Discord Verification Code',
            text: `Thanks for joining our server! Your verification code is: ${verifCode}\nPlease send another message in the #verify channel with your verification code!`,
        };

        mailTransporter.sendMail(details, (err) => {
            if (!err == 'null') {
                console.log(`Mail error: ${err}`);
            }
        });

        embed.setDescription(
            ':white_check_mark:  Email sent! Please reply below with your verification code. Code will expire in 5 minutes.'
        );
        await interaction.editReply({ embeds: [embed] });

        const collectorFilter = (msg) => {
            return msg.author.id === interaction.user.id && msg.content;
        };
        const collector = interaction.channel.createMessageCollector({
            filter: collectorFilter,
            max: 1,
            time: 1000 * 300, // 5 minutes
        });

        collector.on('collect', (msg) => {
            if (msg.content == verifCode) {
                // Things to update in database
                const filter = { userId: interaction.member.id };
                const update = {
                    userId: interaction.member.id,
                    userTag: interaction.user.tag,
                    userVerified: interaction.member.roles.cache.some(
                        (role) => role.name === 'Verified'
                    ),
                };
                let userProfile = User.findOneAndUpdate(filter, update, {
                    upsert: true,
                    new: true,
                });

                console.log(
                    `Member Tag:${userProfile.userTag}, Member verified: ${userProfile.userVerified}`
                );

                // Send embed
                embed.setDescription(':white_check_mark:  Verified!');
                interaction.followUp({ embeds: [embed] });

                // Add role
                const role = interaction.member.guild.roles.cache.find(
                    (role) => role.name === 'Verified'
                );
                interaction.member.roles.add(role);
            } else {
                embed.setDescription(
                    ':x:  Wrong code. Please run /verify again to get a new code.'
                );
                interaction.followUp({ embeds: [embed] });
            }
        });

        collector.on('error', (error) => {
            console.error('Message collector error:', error);
        });

        collector.on('end', (collected, reason) => {
            if (collected.size == 0) {
                embed.setDescription(
                    ':x:  No code detected. Code expired. Run /verify again to get a new code.'
                );
                interaction.followUp({ embeds: [embed] });
            }
        });
    },
};
