import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Attachment, Collection, Client } from "discord.js";
import { RolesChecker } from "../../modules";
import mongoose, { Schema } from "mongoose";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greeting')
        .setDescription('Настройка приветствия новых пользователей')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('info')
                .setDescription('Информация о команде'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('enable')
                .setDescription('Включение/выключение приветствия')
                .addBooleanOption(option =>
                    option.setName('option')
                        .setDescription('Включение/отключение приветствия')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set-channel')
                .setDescription('Установка канала приветствия')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Выбор канала приветствия')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Изменение сообщений прихода-ухода участников')
                .addStringOption(option =>
                    option.setName('message-type')
                        .setDescription('Тип сообщения')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Приход пользователя', value: 'useradd' },
                            { name: 'Уход пользователя', value: 'userremove' },
                        )
                )
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Текст сообщения')
                )
                .addAttachmentOption(option =>
                    option.setName('attachment')
                        .setDescription('Вложение (только изображения!)')
                )
        ),

    async execute(interaction: ChatInputCommandInteraction, commandsData: Collection<unknown, unknown>, client: Client, Model: mongoose.Model<Schema>) {
        if (!RolesChecker(interaction, true)) return interaction.reply('У вас недостаточно прав.');
        const serverDb: any = await Model.findOne({id: interaction.guildId});

        switch (interaction.options.getSubcommand()) {
            case 'info':
                const greetingEmbed = new EmbedBuilder()
                    .setTitle('Приветственные сообщения')
                    .setDescription(`Приветственные сообщения используются для приветствия новых участников. \nВы можете настроить приветственные сообщения с помощью команд \`/greeting enable\`, \`/greeting set-channel\` и \`/greeting edit\`\nКроме того, вы можете использовать следующие пременные в сообщениях:\n* %user% - бот при использовании этой переменной заменяет её на пользователя;\n* %guild% - бот заменяет переменную на название сервера.\n\nТакже вы можете добавлять изображения.`)
                    .setTimestamp()
                    .setColor(0x0080ff)

                return interaction.reply({ embeds: [greetingEmbed], ephemeral: true });
                break;
            case 'enable':
                const option = interaction.options.getBoolean('option');
                if (option) {
                    serverDb.greeting.enabled = true;
                    interaction.reply(`Приветственные сообщения включены!`);
                } else {
                    serverDb.greeting.enabled = false;
                    interaction.reply(`Приветственные сообщения отключены!`);
                }
                break;
            case 'set-channel':
                const channel = interaction.options.getChannel('channel');
                serverDb.greeting.channelId = channel?.id;
                interaction.reply(`Канал ${channel} выбран как канал приветствий!`);
                break;
            case 'edit':
                const messageType = interaction.options.getString('message-type');
                const message = interaction.options.getString('message');
                const attachment = interaction.options.getAttachment('attachment');

                if (messageType == 'useradd') {
                    if (message) {
                        serverDb.greeting.userAddText = message;
                    }

                    if (attachment) {
                        if (attachment.contentType?.includes('image')) {
                            serverDb.greeting.addAttachment = attachment.url;
                        }
                    }
                    interaction.reply('Приветственное сообщение установлено!');
                } else {
                    if(message) {
                        serverDb.greeting.userRemoveText = message;
                    }

                    if (attachment) {
                        if (attachment.contentType?.includes('image')) {
                            serverDb.greeting.removeAttachment = attachment.url;
                        }
                    }
                    interaction.reply('Прощальное сообщение установлено!');
                }
                break;
        }

        if (serverDb.greeting.userAddText == '' || serverDb.greeting.userRemoveText == '') {
            let setup = [];
            if (serverDb.greeting.userAddText == '') setup.push('Сообщение прихода пользователя');
            if (serverDb.greeting.userRemoveText == '') setup.push('Сообщение ухода пользователя');
            interaction.channel?.send(`Кажется, параметр(ы) \`[${setup.join(', ')}]\` не настроен(ы). Не забудьте их настроить командой \`/greeting edit\`!`);
        }
        await serverDb?.save();
    }
}