import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Сведения о версии бота и changelog'),

    async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply('В разработке...');
    }
}