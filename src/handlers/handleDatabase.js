const { connect, connection } = require("mongoose");

module.exports = async (client) => {
    client.handleDatabase = async () => {
        try {

            await connect(process.env.MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: "Bot-Prod"
            });
        } catch (error) {
            console.error(error);
            connection.emit("error", error);
            process.exit(1); // Exiting because otherwise not much point keeping bot alive with no DB connection
        }
    };
};
