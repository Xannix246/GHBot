import { Events, GatewayIntentBits, Partials } from "discord.js";
import { NewClient } from "./modules";
const data = require('./data/data.json');
const listeners = require(`./data/servers/${data.GuildId}.json`);



//creates new client
const client = new NewClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers
    ],
    partials: [
        Partials.Message, 
        Partials.Channel, 
        Partials.Reaction
    ]
});

client.launch();