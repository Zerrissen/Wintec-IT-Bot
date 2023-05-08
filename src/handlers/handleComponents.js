/*------------------ REQUIRES -----------------*/
const { readdirSync } = require('fs');
/*------------------ END OF REQUIRES -----------------*/

/**==============================================
 **                   INFO
 *?  The below function gets exported and made
 *?  Available to the client object in index.js.
 *@return function
 *=============================================**/
module.exports = (client) => {
    client.handleComponents = async () => {
        //* Grab all components and make them available to the client
        const componentFolders = readdirSync('./src/components');
        for (const folder of componentFolders) {
            const componentFiles = readdirSync(
                `./src/components/${folder}`
            ).filter((file) => file.endsWith('.js'));

            const { modals } = client;
            // * Determine the type of component and set its properties accordingly
            switch (folder) {
                case 'modals':
                    for (const file of componentFiles) {
                        const modal = require(`../components/${folder}/${file}`);
                        modals.set(modal.data.name, modal);
                    }
                    break;
                default:
                    break;
            }
        }
    };
};
