//currently this will give a point everytime someone sends a message in discord
//will change to filter by messages are wizard emoted in future

const Balance = require('../../schemas/balance');

module.exports = {
	name: "wizardEmoted",
	async execute(message, client) {
		const storedBalance = await client.fetchBalance(
			message.author.id,
		);
		
		await Balance.findOneAndUpdate(
		{_id: storedBalance._id },
		{
			balance: await client.toFixedNumber(
			storedBalance.balance + 1
			),
		}
		);
	},
};
