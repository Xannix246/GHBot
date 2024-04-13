import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { RolesChecker } from "../../modules";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute-channel')
        .setDescription('Мут канала')
        .addChannelOption(option => (
            option.setName('channel')
                .setDescription('Канал, который необходимо замутить')
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
                channel.permissionOverwrites.edit(`${interaction.guild?.id}`, { SendMessages: false }),
                interaction.reply(`Канал ${channel} замучен.`)
            ] : [
                interaction.reply('Это не текстовый канал.')
            ]
        } else {
            interaction.channel?.type === 0 ? [
                interaction.channel.permissionOverwrites.edit(`${interaction.guild?.id}`, { SendMessages: false }),
                interaction.reply(`Канал ${interaction.channel} замучен.`)
            ] : [
                interaction.reply('Это не текстовый канал.')
            ]
        }
    }
}