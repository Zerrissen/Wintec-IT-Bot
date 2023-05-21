const Balance = require("../../schemas/balance");


module.exports = (client) => {
  client.getBalance = async (userID) => {
    const storedBalance = await Balance.findOne({
		userId: userID,
    });
    
    if (!storedBalance) return false;
	else return storedBalance
  };
};
