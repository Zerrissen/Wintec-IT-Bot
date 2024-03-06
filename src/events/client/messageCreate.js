const { Events } = require("discord.js");
const fs = require("fs");
const path = require("path");
const log = require("../../util/logger");

//TODO: Use responses from database instead of JSON files.
const Responses = require("../../db/response");

module.exports = {
  name: Events.MessageCreate,

  async execute(message) {
    if (message.author.username === "tehgoldenwiz" && message.mentions.has(message.client.user)) {
      const now = new Date().toLocaleString("en-NZ", {
        timeZone: "Pacific/Auckland",
      });
      const hour = parseInt(now.split(",")[1].split(":")[0]);
      let responsesPath;
      if (hour >= 6 && hour < 12) {
        responsesPath = path.join(__dirname, "..", "..", "resources", "morningresponses.json");
      } else if (hour >= 12 && hour < 18) {
        responsesPath = path.join(__dirname, "..", "..", "resources", "afternoonresponses.json");
      }
      if (responsesPath) {
        console.log(responsesPath);
        const responseObject = JSON.parse(fs.readFileSync(responsesPath));
        const responses = responseObject.responses;
        const randomIndex = Math.floor(Math.random() * responses.length);
        const response = responses[randomIndex];
        message.channel.send(response);
        log.success("Client", `Sent easter-egg response to tehgoldenwiz: ${response}`);
      }
    }
  },
};
