import { Client, Events, GuildMember, GuildMemberRoleManager } from "discord.js";
import { ListenMessage } from "global";
const data = require('../data/data.json');

const ListenerLoader = async (client: Client) => {
    const listeners = require(`../data/servers/${data.GuildId}.json`);

    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        if (user.bot) return;
        if (reaction.message.guildId == null) return console.log('not found');

        const guilds = client.guilds.cache.get(reaction.message.guildId);
        const member = guilds?.members.cache.get(user.id);

        listeners.listeners.forEach(async (element: ListenMessage) => {

            try {

                for (let i = 0; i < listeners.listeners.length; i++) {
                    if ((member?.roles as GuildMemberRoleManager).cache.find(role => role.id === element.role)) {
                        if(listeners.listeners.find((el: ListenMessage) => el.role == element.role).message == reaction.message.id) {
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
        if (user.bot) return;
        if (reaction.message.guildId == null) return console.log('not found');

        const guilds = client.guilds.cache.get(reaction.message.guildId);
        const member = guilds?.members.cache.get(user.id);

        listeners.listeners.forEach(async (element: ListenMessage) => {
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