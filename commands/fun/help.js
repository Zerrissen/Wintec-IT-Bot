const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.content === '!help') {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Help')
      .setDescription('This is a help message');

    await message.channel.send({ embeds: [embed] });
  }
});

client.login('YOUR_TOKEN_HERE');
