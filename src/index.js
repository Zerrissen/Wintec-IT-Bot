// Necessary requires and constants
require("dotenv").config();
const fs = require("node:fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const token = process.env.TOKEN;

// New client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Prepare handlers for use.
client.commands = new Collection();
client.commandArray = [];

const handlerFiles = fs
    .readdirSync("./src/handlers")
    .filter((file) => file.endsWith(".js"));
for (const file of handlerFiles) {
    require(`./handlers/${file}`)(client);
}

// Call handlers, then log in with our bot token
client.handleEvents();
client.handleCommands();
client.handleDatabase();
client.login(token);
