const nodemailer = require("nodemailer");
const { EmbedBuilder } = require("discord.js");
const { getUserById, updateUser } = require("../../db/user");
const log = require("../../util/logger");

module.exports = {
  data: {
    name: "verify-email",
  },
  async execute(interaction, client) {
    const address = interaction.fields.getTextInputValue("verifyEmailInput");
    // Just check whether the email is pointing to the right domain
    let studentRegex = /^[a-zA-Z0-9]{1,9}@student\.wintec\.ac\.nz$/i;
    let staffRegex = /^[a-zA-Z]+\.[a-zA-Z]+@wintec\.ac\.nz$/i;
    if (
      !studentRegex.test(address) &&
      !staffRegex.test(address)
    ) {
      const embed = new EmbedBuilder()
        .setColor(0x9c0b0b)
        .setDescription(":x:  Please provide a valid Wintec email address, or contact a moderator.");

      await interaction.reply({ embeds: [embed] });
      return;
    }

    try {
      const userProfile = await getUserById(interaction.user.id);
      if (userProfile.verified === true) {
        updateUser({ discordId: interaction.user.id, email: address });
        const embed = new EmbedBuilder()
          .setColor(0x0f4a00)
          .setDescription(`:white_check_mark:  User: @${userProfile.username} already verified!`);

        await interaction.reply({ embeds: [embed] });
        return;
      }
    } catch (e) {
      log.err("Database", "Error fetching user profile.", e);
    }
    

    // Regex passed, so we can start verifying
    const embed = new EmbedBuilder()
      .setColor(0x0f4a00)
      .setDescription(":arrows_counterclockwise:  Generating code & sending email..");

    await interaction.reply({ embeds: [embed] });

    // We need to generate our verification code and send it to the email address
    let verifCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    let mailTransporter = nodemailer.createTransport({
      host: "smtp.zoho.com.au",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Verify whether the connection has been established
    mailTransporter.verify(function (error, success) {
      if (error) {
        log.err("Mail", "Server is not ready to take our messages.", error);
      } else {
        log.info("Mail", "Server connection established. Ready to send messages.")
      }
    });

    let details = {
      from: process.env.MAIL_USER,
      to: address,
      subject: "Student Discord Verification Code",
      text: `Thanks for joining our server! Your verification code is: ${verifCode}\nPlease send another message in the #verify channel with your verification code!`,
    };

    mailTransporter.sendMail(details, (err) => {
      if (!err == "null") {
        console.log(`Mail error: ${err}`);
      }
    });

    embed.setDescription(
      ":white_check_mark:  Email sent! Please reply below with your verification code. Code will expire in 5 minutes."
    );
    await interaction.editReply({ embeds: [embed] });

    // Now we need to wait for the user to reply with their verification code
    const collectorFilter = (msg) => {
      let regex = /[0-9]/i;
      return msg.author.id === interaction.user.id && regex.test(msg.content);
    };
    const collector = interaction.channel.createMessageCollector({
      filter: collectorFilter,
      max: 1,
      time: 1000 * 300, // 5 minutes
    });

    collector.on("collect", (msg) => {
      // If code is correct, verify them in database and server
      if (msg.content == verifCode) {
        // Things to update in database
        updateUser({ discordId: interaction.user.id, verified: true, email: address });

        // Send embed
        embed.setDescription(":white_check_mark:  Beep boop, you have been verified!");
        interaction.followUp({ embeds: [embed] });

        // Add role
        const role = interaction.member.guild.roles.cache.find((role) => role.name === "Verified");
        interaction.member.roles.add(role);

        // If staff member, give Wintec Staff role
        if (staffRegex.test(address)) {
          const role = interaction.member.guild.roles.cache.find((role) => role.name === "Wintec Staff");
          interaction.member.roles.add(role);
        }

        // We need to get the user object here to be able to call the send() method
        const user = client.users.cache.get(interaction.member.user.id);
        user
          .send(
            "Howdy! It seems you've just verified in the **Wintec IT Student** server. Great! If you're comfortable, please change your server nickname to your first name so your classmates can help tell you apart!"
          ) // Use the following catch for every time we call member.send. Unfortunately no other way around this. See https://discordjs.guide/popular-topics/errors.html#cannot-send-messages-to-this-user
          .catch((error) => {
            console.log(
              chalk.red(`[API] ${member.user.username} cannot be messaged. Not DMing! Error code: ${error.code}`)
            );
          });
      } else {
        // Lol dumbass you didn't send the right code
        embed.setDescription(":x:  Uh oh, wrong code! Please run /verify again to get a new code.");
        embed.setColor(0x9c0b0b);
        interaction.followUp({ embeds: [embed] });
      }
    });

    // Just in case the collector freaks out, it won't crash the bot
    collector.on("error", (error) => {
      console.error("Message collector error:", error);
    });

    // If the collector times out, then you suck
    collector.on("end", (collected, reason) => {
      if (collected.size == 0) {
        embed.setDescription(":x:  No code detected. Code expired. Run /verify again to get a new code.");
        embed.setColor(0x9c0b0b);
        interaction.followUp({ embeds: [embed] });
      }
    });
  },
};
