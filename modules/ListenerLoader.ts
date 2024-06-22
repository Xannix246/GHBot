import { Client, Events, GuildMemberRoleManager } from "discord.js";
import { Data, ListenMessage } from "global";
import mongoose from "mongoose";
const data: Data = require('../data/data.json');

const ListenerLoader = async (client: Client, Model: mongoose.Model<any>) => {

    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        const serverDb: any = await Model.findOne({ id: reaction.message.guildId });
        if (user.bot) return;
        if (reaction.message.guildId == null) return console.log('not found');

        const guilds = client.guilds.cache.get(reaction.message.guildId);
        const member = guilds?.members.cache.get(user.id);

        serverDb.listeners.forEach(async (element: ListenMessage) => {

            try {
                    for (let i = 0; i < serverDb.listeners.length; i++) {
                        if(serverDb.exceptions.some((msg: String) => msg === reaction.message.id)) continue;

                        if ((member?.roles as GuildMemberRoleManager).cache.find(role => role.id === element.role)) {
                            if (serverDb.listeners.find((el: ListenMessage) => el.role == element.role).message == reaction.message.id) {
                                reaction.users.remove(member?.id);
                                return;
                            }
                        }
                    }

                if (reaction.message.id == element.message && reaction.emoji.name == element.reaction) {
                    await member?.roles.add(element.role);
                }
            } catch (err) {
                console.log(err);
            }
        })
    })

    client.on(Events.MessageReactionRemove, async (reaction, user) => {
        const serverDb: any = await Model.findOne({ id: reaction.message.guildId });
        if (user.bot) return;
        if (reaction.message.guildId == null) return console.log('not found');

        const guilds = client.guilds.cache.get(reaction.message.guildId);
        const member = guilds?.members.cache.get(user.id);

        serverDb.listeners.forEach(async (element: ListenMessage) => {
            try {
                if (reaction.message.id == element.message && reaction.emoji.name == element.reaction) {
                    await member?.roles.remove(element.role);
                }
            } catch (err) {
                console.log(err);
            }
        })
    })

    console.log('Listener loaded!');
}

export default ListenerLoader;