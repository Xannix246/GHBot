import { Client, ClientOptions, Collection, Events } from "discord.js";
import mongoose, { Schema } from "mongoose";
import CommandLoader from "./CommandsLoader";
import ListenerLoader from "./ListenerLoader";
import GreetingModule from "./Greeting";
import { Data } from "global";
import DBSync from "./utils/DbAddServer";
import aiModule from "./ai/init";
const data: Data = require('../data/data.json');



//class for extend base client (for more clean index)
class NewClient extends Client {
    commandsData: Collection<unknown, unknown>;
    ServerModel: mongoose.Model<any, unknown, unknown, unknown, any, any>;
    constructor(options: ClientOptions) {
        super(options);
        this.commandsData = new Collection();
        this.ServerModel = mongoose.model('Server');

        this.on('ready', () => {
            console.log('Started!');
            mongoose.connect(data.mongodb)
                .then(() => console.log('connected to MongoDB!'))
                .catch((err) => console.log('failed to connect: ' + err));
            //ListenerLoader(this, this.ServerModel);
            //GreetingModule(this, this.ServerModel);
            aiModule(this);
        })


        //on slash-commands event
        this.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            DBSync(interaction);

            const command: any = this.commandsData.get(interaction.commandName);

            if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

            try {
                command.execute(interaction, this.commandsData, this, this.ServerModel);
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