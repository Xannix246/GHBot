import { AttachmentBuilder, Events, TextChannel } from "discord.js";
import NewClient from "./ClientLoader";
import BotDBSync from "./utils/UnifiedBotDb";
import mongoose from "mongoose";

const InterserverListener = async (client: NewClient) => {
    BotDBSync();
    const Model = mongoose.model('Bot');

    client.on(Events.MessageCreate, async (message) => {
        try {
            const serverDb: any = await Model.findOne({ id: 1 });
            if (message.author.bot) return;
            if (!serverDb.interserverChannels.some((channel: string) => channel === message.channel.id)) return;

            serverDb.interserverChannels.forEach(async (channelId: string) => {
                if (channelId === message.channelId) return;
                const channel = (client.channels.cache.get(channelId) as TextChannel);

                if (!serverDb.channels.some((channel: { id: string, token: string }) => channel.id === channelId)) {
                    const webhook = await channel.createWebhook({
                        name: 'InterserverWebhook'
                    });

                    await serverDb.channels.push({
                        id: channelId,
                        token: webhook.token
                    });

                    await serverDb.save();
                }

                const webhookToken = serverDb.channels.find((channel: { id: string, token: string }) => channel.id === channelId);
                const webhooks = await channel.fetchWebhooks();
                const webhook = webhooks.find(wh => wh.token === webhookToken.token);
                const messageId = message.reference?.messageId;
                const repliedTo = messageId ? message.channel.messages.cache.get(messageId) : undefined;

                if (repliedTo) {
                    const repliedContent = repliedTo.content.split('\n');
                    if (repliedContent[0].startsWith('>')) {
                        repliedContent.shift();
                    }
                    repliedTo.content = repliedContent.slice(0, 97).join('...\n');
                }

                const messages = await channel.messages.fetch({ limit: 100 });
                const targetMessage = messages.find(msg => msg.content.includes(repliedTo?.content as string));

                const messageUrl = targetMessage && repliedTo?.content !== '' ? `<https://discord.com/channels/${targetMessage.guild.id}/${targetMessage.channel.id}/${targetMessage.id}>` : '';
                const displayName = targetMessage && repliedTo?.content !== '' ? `**[${repliedTo?.author.displayName}](${messageUrl})**: ` : `**${repliedTo?.author.displayName}**: `;
                const attachments = message.attachments.map(attachment => new AttachmentBuilder(attachment.url, { name: attachment.name }));

                if(repliedTo?.content.length as number > 100 && repliedTo?.content) repliedTo.content = repliedTo.content.slice(0, 100) + (repliedTo?.content.length as number > 100 ? `...     [перейти](${messageUrl})` : '')
                if(repliedTo?.content == '') repliedTo.content = ` \`Вложение\``

                await webhook?.send({
                    content: `${messageId ? '> ' + displayName + repliedTo?.content : ''}\n${message.content}`,
                    files: attachments,
                    username: message.author.globalName || message.author.username,
                    avatarURL: message.author.displayAvatarURL()
                });
            });
        } catch (e) {
            console.log(e);
        }
    });
}

export default InterserverListener;