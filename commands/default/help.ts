import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Collection } from "discord.js";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Перечень базовых команд'),

    async execute(interaction: ChatInputCommandInteraction, commandsData: Collection<unknown, unknown>) {
        const helpEmbed = new EmbedBuilder()
            .setTitle('помощь')
            .setDescription(`${commandsData.map((element: any) => `\n\`/${element.data.name}\` - ${element.data.description || "без описания"}`)}`)
            .setTimestamp()
            .setColor(0x0080ff)

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }
}