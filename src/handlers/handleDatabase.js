const { connect, connection } = require("mongoose");
const path = require("path");

module.exports = async (client) => {
    client.handleDatabase = async () => {
        try {
            let mongoCertPath = path.resolve(process.env.MONGO_CERT_PATH);

            await connect(process.env.MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                tlsCAFile: mongoCertPath
            });
        } catch (error) {
            connection.emit('error', error)
            process.exit(1);
        }
    }
};