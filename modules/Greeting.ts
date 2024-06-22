import { Client, EmbedBuilder, Events, TextChannel } from "discord.js";
import { Data } from "global";
import mongoose from "mongoose";
const data: Data = require('../data/data.json');

const GreetingModule = async (client: Client, Model: mongoose.Model<any>) => {
    const serverDb: any = await Model.findOne({ id: data.GuildId });
    const channel = client.channels.cache.get(serverDb.greeting.channelId);
    const guild = client.guilds.cache.get(data.GuildId);

    if (serverDb.greeting.enabled) {
        if (channel === undefined) return;

        client.on(Events.GuildMemberAdd, async (user) => {
            const serverDb: any = await Model.findOne({ id: data.GuildId });
            if (serverDb.greeting.userAddText == '') return;

            const message = serverDb.greeting.userAddText
                .replaceAll('%user%', `${user}`)
                .replaceAll('%guild%', `${guild}`);



            const greetingEmbed = new EmbedBuilder()
                .setTitle('Приветствие')
                .setDescription(message)
                .setColor(0x0080ff)

            if (serverDb.greeting.addAttachment) {
                greetingEmbed.setImage(serverDb.greeting.addAttachment);
            }

            (channel as TextChannel).send({ content: `${user}`, embeds: [greetingEmbed] });
        })

        client.on(Events.GuildMemberRemove, async (user) => {
            const serverDb: any = await Model.findOne({ id: data.GuildId });
            if (serverDb.greeting.userRemoveText == '') return;

            const message = serverDb.greeting.userRemoveText
                .replaceAll('%user%', `${user}`)
                .replaceAll('%guild%', `${guild}`);

            const greetingEmbed = new EmbedBuilder()
                .setTitle('Прощание')
                .setDescription(message)
                .setColor(0x0080ff)

            if (serverDb.greeting.removeAttachment) {
                greetingEmbed.setImage(serverDb.greeting.removeAttachment);
            }

            (channel as TextChannel).send({ embeds: [greetingEmbed] });
        });
    }

    console.log('Greet module loaded!');
}

export default GreetingModule;