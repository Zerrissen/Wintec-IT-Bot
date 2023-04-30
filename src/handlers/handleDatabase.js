const { connect, connection } = require("mongoose");
const path = require("path");

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
            process.exit(1);
        }
    };
};
