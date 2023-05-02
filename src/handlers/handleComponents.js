const { readdirSync } = require('fs');

module.exports = (client) => {
    client.handleComponents = async () => {
        const componentFolders = readdirSync('./src/components');
        for (const folder of componentFolders) {
            const componentFiles = readdirSync(
                `./src/components/${folder}`
            ).filter((file) => file.endsWith('.js'));

            const { modals } = client;
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
