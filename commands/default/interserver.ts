import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('interserver')
        .setDescription('бла-бла'),

    async execute(interaction: ChatInputCommandInteraction) {
        
    }
}



//a template for commands. new commands files can be named as Name of command.