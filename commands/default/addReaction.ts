import { ChatInputCommandInteraction, Message, TextChannel } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import fs from 'fs';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-reaction')
        .setDescription('Добавление выдачи ролей по реакции')
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('info')
        //         .setDescription('Информация о команде'))
        .addSubcommand((subcommand: any) =>
            subcommand
                .setName('add')
                .setDescription('Добавление выдачи ролей')
                .addChannelOption((option: any) =>
                    option.setName('channel')
                        .setDescription('Канал, где находится сообщение')
                        .setRequired(true)
                )
                .addStringOption((option: any) =>
                    option.setName('message')
                        .setDescription('Укажите id сообщения')
                        .setRequired(true))
                .addStringOption((option: any) =>
                    option.setName('reaction')
                        .setDescription('Укажите реакцию')
                        .setRequired(true))
                .addRoleOption((option: any) =>
                    option.setName('role')
                        .setDescription('Выберите роль для выдачи')
                        .setRequired(true))
            )
        .addSubcommand((subcommand: any) =>
            subcommand
                .setName('remove')
                .setDescription('Удаление выдачи ролей')),

    async execute(interaction: ChatInputCommandInteraction) {
        let listeners = require(`../../data/servers/${interaction.guildId}.json`);



        if(interaction.options.getSubcommand() == 'add') {
            const channel = interaction.options.getChannel('channel');
            let message: string | Message<true> | null = interaction.options.getString('message');
            const reaction = interaction.options.getString('reaction');
            const role = interaction.options.getRole('role');

            try {
                    message = await (interaction.guild?.channels.cache.get(channel?.id as string) as TextChannel)?.messages.fetch(message as string);
            } catch(err) {
                return interaction.reply('Сообщение не найдено.');
            }

            listeners.listeners.push({
                "channel": `${channel?.id}`,
                "message": `${message.id}`,
                "reaction": `${reaction}`,
                "role": `${role?.id}`
            })

            fs.writeFileSync(`./data/servers/${interaction?.guildId}.json`, JSON.stringify(listeners, null, 4));
            message.react(reaction as string);
            interaction.reply('Успешно добавлено!');
        } else if(interaction.options.getSubcommand() == 'remove') {

        } else interaction.reply('Произошла неизвестная ошибка.');
    }
}