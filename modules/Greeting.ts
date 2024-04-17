import { Client, EmbedBuilder, Events, TextChannel } from "discord.js";
import { Data, GreetingUser } from "global";
const data: Data = require('../data/data.json');

const GreetingModule = (client: Client) => {
    const greeting: GreetingUser = require(`../data/servers/${data.GuildId}.json`).greeting;
    const channel = client.channels.cache.get(greeting.channelId);
    const guild = client.guilds.cache.get(data.GuildId);

    if (greeting.enabled) {
        if (channel === undefined) return;

        client.on(Events.GuildMemberAdd, async (user) => {
            if (greeting.userAddText == '') return;

            const message = greeting.userAddText
                .replaceAll('%user%', `${user}`)
                .replaceAll('%guild%', `${guild}`);


            function greet() {
                const greetingEmbed = new EmbedBuilder()
                    .setTitle('Приветствие')
                    .setDescription(message)
                    .setColor(0x0080ff)

                return greetingEmbed;
            }

            let embed = greet();

            if(greeting.addAttachment != '') {
                embed.setImage(`${greeting.addAttachment}`);
            }

            (channel as TextChannel).send({ content: `${user}`, embeds: [embed] });
        })

        client.on(Events.GuildMemberRemove, async (user) => {
            if (greeting.userRemoveText == '') return;

            const message = greeting.userRemoveText
                .replaceAll('%user%', `${user}`)
                .replaceAll('%guild%', `${guild}`);

            function greet() {
                const greetingEmbed = new EmbedBuilder()
                    .setTitle('Прощание')
                    .setDescription(message)
                    .setColor(0x0080ff)

                return greetingEmbed;
            }

            let embed = greet();

            if(greeting.addAttachment != '') {
                embed.setImage(`${greeting.removeAttachment}`);
            }

            (channel as TextChannel).send({ embeds: [embed] });
        });
    }

    console.log('Greet module loaded!');
}

export default GreetingModule;