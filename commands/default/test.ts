import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { RolesChecker } from "../../modules";
import { GreetingUser } from "global";
const data = require('../../data/data.json');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('бла-бла'),

    async execute(interaction: ChatInputCommandInteraction) {
        const greeting: GreetingUser = require(`../../data/servers/${data.GuildId}.json`).greeting;

        try { 
            const greetingEmbed = new EmbedBuilder()
                    .setTitle('Приветствие')
                    .setDescription('1111')
                    .setColor(0x0080ff)
                    .setImage(`${greeting.addAttachment}`);
                    
            await interaction.reply({ embeds: [greetingEmbed]});
        } catch(err) {
            console.log(err);
            await interaction.reply(`чёта не работает: ${err}`);
        }
    }
}