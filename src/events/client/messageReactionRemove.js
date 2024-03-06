const { Events } = require("discord.js");
const { decrementWizardPoints } = require("../../db/user");
const log = require("../../util/logger");

module.exports = {
  name: Events.MessageReactionRemove,
  async execute(reaction, user) {
    if (reaction.partial) {
      // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
      try {
        await reaction.fetch();
      } catch (error) {
        log.err("API", "Something went wrong when fetching the message:", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }

    // We only care about the wizard emoji for wizard points :)

    if (reaction.emoji.name != "wizard") {
      return;
    }

    if (reaction.message.author.id === user.id) {
      return;
    }

    decrementWizardPoints(reaction.message.author.id);
  },
};
