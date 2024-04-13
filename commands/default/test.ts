import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { RolesChecker } from "../../modules";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('бла-бла'),

    async execute(interaction: ChatInputCommandInteraction) {
        try { 
            await interaction.reply({ content: `всё оке` });
        } catch(err) {
            console.log(err);
            await interaction.reply(`чёта не работает: ${err}`);
        }
    }
}