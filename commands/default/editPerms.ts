import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Collection, Client } from "discord.js";
import { RolesChecker } from '../../modules';
import mongoose, { Schema } from "mongoose";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit-perms')
        .setDescription('Настройка прав сервера')
        .addSubcommand((subcommand: any) =>
        .addSubcommand((subcommand: any) =>
            subcommand
                .setName('list')
                .setDescription('Список прав сервера'))
        .addSubcommand((subcommand: any) =>
        .addSubcommand((subcommand: any) =>
            subcommand
                .setName('add')
                .setDescription('Добавить роль')
                .addStringOption((option: any) =>
                .addStringOption((option: any) =>
                    option.setName('category')
                        .setDescription('Тип прав')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Администратор', value: 'admin' },
                            { name: 'Модератор', value: 'moderator' },
                        ))
                .addRoleOption((option: any) => option.setName('add-role').setRequired(true).setDescription('Выберите роль'))
                .addRoleOption((option: any) => option.setName('add-role').setRequired(true).setDescription('Выберите роль'))
        )
        .addSubcommand((subcommand: any) =>
        .addSubcommand((subcommand: any) =>
            subcommand
                .setName('remove')
                .setDescription('Удалить роль')
                .addRoleOption((option: any) => option.setName('remove-role').setRequired(true).setDescription('Выберите роль'))
                .addRoleOption((option: any) => option.setName('remove-role').setRequired(true).setDescription('Выберите роль'))
        ),

    async execute(interaction: ChatInputCommandInteraction, commandsData: Collection<unknown, unknown>, client: Client, Model: mongoose.Model<Schema>) {
        if (!RolesChecker(interaction, true)) return interaction.reply('У вас недостаточно прав.');
        const serverDb: any = await Model.findOne({id: interaction.guildId});

        const permsListEbmed = new EmbedBuilder()
            .setDescription(`Список прав сервера`)
            .addFields(
                { name: 'Административные права', value: `${serverDb?.administration.map((el: any) => `<@&${el}>`).join(', ') || 'Отсутствуют'}` },
                { name: 'Модеративные права', value: `${serverDb?.moderation.map((el: any) => `<@&${el}>`).join(', ') || 'Отсутствуют'}` }
            )
            .setColor(0x0080ff)
            .setFooter({ text: 'Вы можете изменять права, используя подкоманды add и remove.' });

        if (interaction.options.getSubcommand() == 'list') {
            interaction.reply({ embeds: [permsListEbmed] });
        } else if (interaction.options.getSubcommand() == 'add') {
            const role = interaction.options.getRole('add-role');

            if (interaction.options.getString('category') == 'admin') {
                await serverDb?.administration.push(role?.id);
                interaction.reply({ content: `Роль ${role} добавлена в категорию администраторов.`, flags: ['4096'] });
            } else {
                await serverDb?.moderation.push(role?.id);
                interaction.reply({ content: `Роль ${role} добавлена в категорию модераторов.`, flags: ['4096'] })
            }
        } else if (interaction.options.getSubcommand() == 'remove') {
            const role = interaction.options.getRole('remove-role');

            for (let i = 0; i < serverDb?.administration.length; i++) {
                if (serverDb?.administration[i] == role?.id) serverDb?.administration.splice(i, 1);
            }

            for (let i = 0; i < serverDb?.moderation.length; i++) {
                if (serverDb?.moderation[i] == role?.id) serverDb?.moderation.splice(i, 1);
            }
            interaction.reply({ content: `Роль ${role} удалена из всех категорий.`, flags: ['4096'] });
        } else interaction.reply('Произошла неизвестна ошибка');

        await serverDb?.save();
    }
}