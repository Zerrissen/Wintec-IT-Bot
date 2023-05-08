/**-------------------------------------------------------
 * *                   INFO
 *   This is the bot command handler. It collects
 *   all the commands and registers them as interactions.
 *----------------------------------------------------**/

/*------------------ REQUIRES -----------------*/

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const chalk = require("chalk");
const fs = require("node:fs");

/*------------------ END OF REQUIRES -----------------*/

/**==============================================
 **                   INFO
 *?  The below function gets exported and made
 *?  Available to the client object in index.js.
 *@return function
 *=============================================**/
module.exports = (client) => {
  client.handleCommands = async () => {
    //* Grab the commands and make them available to the client
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        //* We need to make sure the command has been set up properly before registering it
        if ("data" in command && "execute" in command) {
          commands.set(command.data.name, command);
          commandArray.push(command.data.toJSON());
        } else {
          console.log(
            chalk.red(
              `[Command] The command at ${$folder}/${file} is missing a required "data" or "execute" property. Skipping command.`
            )
          );
        }
      }
    }

    //* Now we get to actually register the commands as interactions to be used by users.
    const clientID = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    try {
      console.log(
        chalk.cyan("[Command] Started refreshing slash (/) commands...")
      );

      await rest.put(Routes.applicationGuildCommands(clientID, guildId), {
        body: client.commandArray,
      });
    } catch (error) {
      console.error(error);
    } finally {
      console.log(
        chalk.green("[Command] Slash (/) commands successfully registered")
      );
    }
  };
};
