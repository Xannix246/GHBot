import { ChatInputCommandInteraction, SlashCommandBuilder, GuildMember } from "discord.js";
import { RolesChecker } from "../../modules";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Мут участника')
        .addUserOption(option => (
            option.setName('user')
                .setDescription('Пользователь, которого необходимо замутить')
                .setRequired(true)
        ))
        .addIntegerOption(option => (
            option.setName('time')
                .setDescription('Время (в минутах); 0 - размут')
                .setRequired(false)
        ))
        .addStringOption(option => (
            option.setName('reason')
                .setDescription('Причина')
                .setRequired(false)
        )),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!RolesChecker(interaction, false)) return interaction.reply('У вас недостаточно прав.');

        let time: number | null = (interaction.options.getInteger('time') ?? 60) * 1000 * 60;
        if (time === 0) time = null;

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') ?? 'Нет причины';

        (user as GuildMember).timeout(time, reason);

        if (time === null) {
            interaction.reply(`Пользователь ${user} выведен из тайм-аута`);
        } else {
            interaction.reply(`Пользователь ${user} отправлен в тайм-аут по причине: ${reason}`);
        }
        //не работает, всё ещё крашит от недостатка прав
    }
}