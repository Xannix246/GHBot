import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { RolesChecker } from "../../modules";
import { Data, GreetingUser } from "global";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('бла-бла'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(`дарова`);
    }
}