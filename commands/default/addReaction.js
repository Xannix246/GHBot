const { SlashCommandBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-reaction')
        .setDescription('Добавление выдачи ролей по реакции')
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName('info')
        //         .setDescription('Информация о команде'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Добавление выдачи ролей')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Канал, где находится сообщение')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Укажите id сообщения')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reaction')
                        .setDescription('Укажите реакцию')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Выберите роль для выдачи')
                        .setRequired(true))
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Удаление выдачи ролей')),

    async execute(interaction) {
        let listeners = require(`../../data/servers/${interaction.guildId}.json`);



        if(interaction.options.getSubcommand() == 'add') {
            const channel = interaction.options.getChannel('channel');
            let message = interaction.options.getString('message');
            const reaction = interaction.options.getString('reaction');
            const role = interaction.options.getRole('role');

            try {
                message = await interaction.guild?.channels.cache.get(channel?.id).messages.fetch(message);
            } catch(err) {
                return interaction.reply('Сообщение не найдено.');
            }

            listeners.listeners.push({
                "channel": `${channel.id}`,
                "message": `${message.id}`,
                "reaction": `${reaction}`,
                "role": `${role.id}`
            })

            fs.writeFileSync(`./data/servers/${interaction?.guildId}.json`, JSON.stringify(listeners, null, 4));
            message.react(reaction);
            interaction.reply('Успешно добавлено!');
        } else if(interaction.options.getSubcommand() == 'remove') {

        } else interaction.reply('Произошла неизвестная ошибка.');
    }
}