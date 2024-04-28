import { Client, ClientOptions, Collection, Events } from "discord.js";
import mongoose from "mongoose";
import CommandLoader from "./CommandsLoader";
import ListenerLoader from "./ListenerLoader";
import GreetingModule from "./Greeting";
import { Data } from "global";
import Server from "./utils/MongodbSync";
import DBSync from "./utils/DbAddServer";
const data: Data = require('../data/data.json');



//class for extend base client (for more clean index)
class NewClient extends Client {
    commandsData: Collection<unknown, unknown>;
    constructor(options: ClientOptions) {
        super(options);
        this.commandsData = new Collection();

        this.on('ready', () => {
            console.log('Started!');
            mongoose.connect(data.mongodb)
                .then(() => console.log('connected to MongoDB!'))
                .catch((err) => console.log('failed to connect: ' + err));
            ListenerLoader(this);
            GreetingModule(this);
        })


        //on slash-commands event
        this.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            const ServerModel = mongoose.model('Server');
            DBSync(interaction);

            const command: any = this.commandsData.get(interaction.commandName);

            if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

            try {
                command.execute(interaction, this.commandsData, this, ServerModel);
            } catch (err) {
                interaction.followUp(`Произошла ошибка. За подробностями обратитесь к разработчикам: ${err}`);
                console.log(err);
            }
        })
    }


    //starting the bot
    async launch() {
        await CommandLoader(this);
        return this.login(data.token);
    }
}

export default NewClient;