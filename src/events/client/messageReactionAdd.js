//currently this will give a point everytime someone sends a message in discord
//will change to filter by messages are wizard emoted in future

const { Events } = require('discord.js');
const Balance = require('../../schemas/balance');


module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error(
                    'Something went wrong when fetching the message:',
                    error
                );
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        // We only care about the wizard emoji for wizard points :)
        //"1110053475309592636" is wizard emoji id
        if (reaction.emoji.name != 'wizard') {
            return;
        }

        if (reaction.message.author.id === user.id) {
            return;
        }

        const filter = {
            userId: reaction.message.author.id,
        };

        const storedUpdate = {
            userId: reaction.message.author.id,
        };

        // Init balance if doesn't already exist, also allows us to add to previous balance.
        const storedBalance = await Balance.findOneAndUpdate(
            filter,
            storedUpdate,
            {
                upsert: true,
                new: true,
            }
        );

        const update = {
            userId: reaction.message.author.id,
            balance: storedBalance.balance + 1,
        };

        let userBalance = await Balance.findOneAndUpdate(filter, update, {
            upsert: true,
            new: true,
        });
    },
};
