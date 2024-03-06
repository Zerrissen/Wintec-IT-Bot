const chalk = require("chalk");

const time = new Date().toLocaleString().replace(",", "") + " ";

module.exports = {
    info: (type, message) => {
      console.log(time + chalk.blue(`[${type} Info] ${message}`));
    },
    success: (type, message) => {
      console.log(time + chalk.green(`[${type} Success] ${message}`));
    },
    err: (type, message, error) => {
      let output = `[${type} Error] ${message}`;
      if (error) {
        output += ` - ${error}`;
      }
      console.log(chalk.red(time + output));
    },
};
