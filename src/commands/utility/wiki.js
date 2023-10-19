const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const badWords = require('bad-words');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wiki")
        .setDescription(
            "Search for a Wikipedia page and return its introduction"
        )
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("The search query")
                .setRequired(true)
        ),
    // Time to do our wikipedia query using the wikipedia API
    // We want to use the search endpoint to allow for more flexibility in the search query
    async execute(interaction) {
        const query = interaction.options.getString("query");

        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            query
        )}&utf8=&format=json`;
        const searchResponse = await axios.get(searchUrl);
        const searchResults = searchResponse.data.query.search;

        if (searchResults.length === 0) {
            await interaction.reply("No results found for the given query.");
            return;
        }

        const title = searchResults[0].title;

        // Now we can parse the search result title to get the page summary with a secondary API request
        // We can also grab the wikipedia page thumbnail
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            title
        )}`;
        try {
            const summaryResponse = await axios.get(summaryUrl);
            const { extract, content_urls, thumbnail, originalimage } =
                summaryResponse.data;

            const filter = new badWords();

            const embed = new EmbedBuilder()
                .setColor(0x0f4a00)
                .setTitle(title)
                .setURL(content_urls.desktop.page)
                .setDescription(extract);

            // Some embeds don't have thumbnails. Also, we want at least a *little* bit of filtering just in case.
            if (thumbnail && !filter.isProfane(query) && !filter.isProfane(title)) {
                embed.setImage(thumbnail.source);
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(
                "An error occurred while searching for the Wikipedia page."
            );
        }
    },
};
