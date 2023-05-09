/**-------------------------------------------------------
 * *                   INFO
 *   This is the database handler. It manages the connection
 *   to the database
 *----------------------------------------------------**/


/*------------------ REQUIRES -----------------*/
const { connect, connection } = require('mongoose');
/*------------------ END OF REQUIRES -----------------*/

/**==============================================
 **                   INFO
 *?  The below function gets exported and made
 *?  Available to the client object in index.js.
 *@return function
 *=============================================**/
module.exports = async (client) => {
    client.handleDatabase = async () => {
        //* All we really need to do is make sure we can connect to the database.
        //* If we can't, then we lose the majority of our bots functionality.
        try {
            await connect(process.env.MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: 'Bot-Prod',
            });
        } catch (error) {
            console.error(error);
            connection.emit('error', error);
            process.exit(1); // Exiting because otherwise not much point keeping bot alive with no DB connection
        }
    };
};
