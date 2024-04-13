import { ChatInputCommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js";
import { RolesChecker } from "../../modules";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute-channel')
        .setDescription('Размут канала')
        .addChannelOption(option => (
            option.setName('channel')
                .setDescription('Канал, который необходимо размутить')
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
        )),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!RolesChecker(interaction, true)) return interaction.reply('У вас недостаточно прав.');

        if (interaction.options.getChannel('channel')) {
            const channelId = interaction.options.getChannel('channel')?.id;
            if (!channelId) return interaction.reply('Канал не найден.');

            const channel = interaction.guild?.channels.cache.get(channelId);

            channel?.type === 0 ? [
                channel.permissionOverwrites.edit(`${interaction.guild?.id}`, { SendMessages: true }),
                interaction.reply(`Канал ${channel} размучен.`)
            ] : [
                interaction.reply('Это не текстовый канал.')
            ]
        } else {
            interaction.channel?.type === 0 ? [
                interaction.channel.permissionOverwrites.edit(`${interaction.guild?.id}`, { SendMessages: true }),
                interaction.reply(`Канал ${interaction.channel} размучен.`)
            ] : [
                interaction.reply('Это не текстовый канал.')
            ]
        }
    }
}