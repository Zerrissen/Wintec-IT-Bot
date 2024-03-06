/**-------------------------------------------------------
 * *                   INFO
 *   This is the bot event handler. It handles events
 *   emitted by different modules and components while
 *   the bot is running.
 *----------------------------------------------------**/

/*------------------ REQUIRES -----------------*/
const fs = require("node:fs");
/*------------------ END OF REQUIRES -----------------*/

/**==============================================
 **                   INFO
 *?  The below function gets exported and made
 *?  Available to the client object in index.js.
 *@return function
 *=============================================**/
module.exports = (client) => {
  client.handleEvents = async () => {
    //* Collect all events we need to listen for
    const eventFolders = fs.readdirSync("./src/events");
    for (const folder of eventFolders) {
      const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith(".js"));
      /*------------------ EVENT LISTENERS -----------------*/
      //* Fire approprate code as relevant events are emitted.
      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            if (event.once) {
              client.once(event.name, (...args) => event.execute(...args, client));
            } else {
              client.on(event.name, (...args) => event.execute(...args, client));
            }
          }
          break;
        default:
          break;
      }
      /*------------------ END OF EVENT LISTENERS -----------------*/
    }
  };
};
