import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from 'fs';
import { RolesChecker } from '../../modules';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit-perms')
        .setDescription('Настройка прав сервера')
        .addSubcommand((subcommand: any) =>
            subcommand
                .setName('list')
                .setDescription('Список прав сервера'))
        .addSubcommand((subcommand: any) =>
            subcommand
                .setName('add')
                .setDescription('Добавить роль')
                .addStringOption((option: any) =>
                    option.setName('category')
                        .setDescription('Тип прав')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Администратор', value: 'admin' },
                            { name: 'Модератор', value: 'moderator' },
                        ))
                .addRoleOption((option: any) => option.setName('add-role').setRequired(true).setDescription('Выберите роль'))
        )
        .addSubcommand((subcommand: any) =>
            subcommand
                .setName('remove')
                .setDescription('Удалить роль')
                .addRoleOption((option: any) => option.setName('remove-role').setRequired(true).setDescription('Выберите роль'))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!RolesChecker(interaction, true)) return interaction.reply('У вас недостаточно прав.');

        let roles = require(`../../data/servers/${interaction?.guildId}.json`);

        const permsListEbmed = new EmbedBuilder()
            .setDescription(`Список прав сервера`)
            .addFields(
                { name: 'Административные права', value: `${roles.administration.map((el: any) => `<@&${el}>`).join(', ') || 'Отсутствуют'}` },
                { name: 'Модеративные права', value: `${roles.moderation.map((el: any) => `<@&${el}>`).join(', ') || 'Отсутствуют'}` }
            )
            .setColor(0x0080ff)
            .setFooter({ text: 'Вы можете изменять права, используя подкоманды add и remove.' });

        if (interaction.options.getSubcommand() == 'list') {
            interaction.reply({ embeds: [permsListEbmed] });
        } else if (interaction.options.getSubcommand() == 'add') {
            const role = interaction.options.getRole('add-role');

            if (interaction.options.getString('category') == 'admin') {
                roles.administration.push(role?.id);
                interaction.reply({ content: `Роль ${role} добавлена в категорию администраторов.`, flags: ['4096'] });
            } else {
                roles.moderation.push(role?.id);
                interaction.reply({ content: `Роль ${role} добавлена в категорию модераторов.`, flags: ['4096'] })
            }
            fs.writeFileSync(`./data/servers/${interaction?.guildId}.json`, JSON.stringify(roles, null, 4));
        } else if (interaction.options.getSubcommand() == 'remove') {
            const role = interaction.options.getRole('remove-role');

            for (let i = 0; i < roles.administration.length; i++) {
                if (roles.administration[i] == role?.id) roles.administration.splice(i, 1);
            }

            for (let i = 0; i < roles.moderation.length; i++) {
                if (roles.moderation[i] == role?.id) roles.moderation.splice(i, 1);
            }

            fs.writeFileSync(`./data/servers/${interaction?.guildId}.json`, JSON.stringify(roles, null, 4));
            interaction.reply({ content: `Роль ${role} удалена из всех категорий.`, flags: ['4096'] });

        } else interaction.reply('Произошла неизвестна ошибка');
    }
}