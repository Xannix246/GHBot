import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { RolesChecker } from "../../modules";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Кик участника'),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!RolesChecker(interaction, false)) return interaction.reply('У вас недостаточно прав.');

    }
}