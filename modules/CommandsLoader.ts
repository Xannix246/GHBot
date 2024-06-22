import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';
import { Guild, REST, Routes } from "discord.js";
import { Data } from 'global';
import NewClient from './ClientLoader';
const data: Data = require('../data/data.json');



//loads commands in './commands' folder
const CommandLoader = async (client: NewClient) => {

    const files = new Glob('**/commands/**/*.@(ts|js)', {});
    const commandsList: any = [];

    for await (const file of files) {
        const command = require(`../${file}`);

        try {
            client.commandsData.set(command.data.name, command);
            commandsList.push(command.data.toJSON());
            console.log('\x1b[32m%s\x1b[0m', `✅ Command ${command.data.name} (${file}) validated successfully! ✅`);
        } catch (err) {
            console.error('\x1b[31m%s\x1b[0m', `⚠️  File ${file} doesn't contain .name! ⚠️`);
        }
    }

    //updating slash-commands (you can turn off it on data.json)
    if (data.updateCommands) {
        client.once('ready', async () => {
            try {
                const rest = new REST().setToken(data.token);

                for (const [guildId, guild] of client.guilds.cache) {
                    await rest.put(
                        Routes.applicationGuildCommands(data.ClientId, guildId),
                        { body: commandsList }
                    );
                }

                console.log(`${commandsList.length} commands reloaded`);
            } catch (err) {
                console.log(err);
            }
        });
    }
}


export default CommandLoader;