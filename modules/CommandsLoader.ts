import { glob, globSync, globStream, globStreamSync, Glob } from 'glob';
import { Client, REST, Routes } from "discord.js";
import { Data } from 'global';
const data: Data = require('../data/data.json');



//loads commands in './commands' folder
const CommandLoader = async (client: any) => {

    const files = new Glob('**/commands/**/*.@(ts|js)', {});
    const commandsList = [];

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
        const rest = new REST().setToken(data.token);
        (async () => {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(data.ClientId, data.GuildId),
                    { body: commandsList }
                )
                console.log(`${commandsList.length} commands reloaded`)
            } catch (err) {
                console.log(err);
            }
        })();
    }
}

export default CommandLoader;