/**========================================================================
 * ?                                ABOUT
 * @repo           :  https://github.com/zerrissen/wintec-it-bot
 * @description    :  Entry point for the Wintec IT bot. This file calls all handlers and logs in the bot.
 *========================================================================**/

/*------------------ REQUIRES -----------------*/
require('dotenv').config();
const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
/*------------------ END OF REQUIRES -----------------*/

/*------------------ CLIENT SETUP -----------------*/
//! DANGER ZONE! DON'T SET THIS IN CLEARTEXT HERE. USE A .ENV FILE.
const token = process.env.TOKEN;
//* Client intents are declared to specify what permissions the client requires to run.
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

//* Collections and array are used to store all the client interactions/commands
client.modals = new Collection();
client.commands = new Collection();
client.commandArray = [];

//* Because we have multiple handlers in various locations, we need to dynamically import them.
const handlerFiles = fs
    .readdirSync('./src/handlers')
    .filter((file) => file.endsWith('.js'));
for (const file of handlerFiles) {
    require(`./handlers/${file}`)(client);
}
/*------------------ END OF CLIENT SETUP -----------------*/



/*------------------ INITIALIZE CLIENT -----------------*/
//* Start handlers to register commands and start listening for events
client.handleEvents();
client.handleCommands();
client.handleComponents();
client.handleDatabase();
//* Boom, time to start the bot!
client.login(token);
