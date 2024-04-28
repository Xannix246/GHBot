import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CollectorFilter, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Выключение бота'),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id == '879039258793480273' || interaction.user.id == '918187023230201876') {
            const confirm = new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Отключить')
                .setStyle(ButtonStyle.Danger);

            const cancel = new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Отмена')
                .setStyle(ButtonStyle.Secondary);

            const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder({
                components: [cancel, confirm]
            });


            const response = await interaction.reply({ content: 'Вы действительно хотите завершить работу бота?', components: [row] });

            try {
                const confirmation = await response.awaitMessageComponent({ filter: (i) => i.user.id === interaction.user.id, time: 60_000 });

                if (confirmation.customId === 'confirm') {
                    await confirmation.update({ content: 'Завершение работы...', components: [] });
                    process.exit(0);
                } else if (confirmation.customId === 'cancel') {
                    await confirmation.update({ content: 'Завершение работы отменено.', components: [] });
                }
            } catch {
                await interaction.editReply({ content: 'Подтверждение не получено, отмена.', components: [] });
            }
        } else {
            return interaction.reply('У вас недостаточно прав.');
        }
    }
}