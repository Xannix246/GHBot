import { ChatInputCommandInteraction, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { RolesChecker } from "../../modules";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Бан пользователя')
        .addUserOption((option) => (
            option.setName('user')
                .setDescription('Пользователь')
                .setRequired(true)
        ))
        .addStringOption(option => (
            option.setName('reason')
                .setDescription('Причина бана')
                .setRequired(false)
        )),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!RolesChecker(interaction, false)) return interaction.reply('У вас недостаточно прав.');

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'Причина не указана';

        if (!user) return;

        interaction.guild?.members.ban(user, { reason: reason });

        interaction.reply(`Пользователь ${user} забанен по причине: ${reason}`);
    }
}