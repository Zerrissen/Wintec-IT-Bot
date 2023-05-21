const Balance = require("../../schemas/balance");
const { Types } = require("mongoose");

module.exports = (client) => {
	data: {
		name:'fetchbalance',
	},
  client.fetchBalance = async (userID) => {
    let storedBalance = await Balance.findOne({
      userId: userID,
    });
    
    if (!storedBalance) {
      storedBalance = await new Balance({
        _id: Types.ObjectID(),
        userID: userID,
      });
      
      await storedBalance.save().then(async balance => {
        console.log(`[Balance Created]: UserID: ${balance.userId}`);
	  }).catch(console.error);
	  return storedBalance
	} else return storedBalance
  };
};
