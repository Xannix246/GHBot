import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";



module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Сообщения от имени бота')
        .addBooleanOption((option) =>
            option.setName('useembed')
                .setDescription('Использовать embed-тип сообщения?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('message')
                .setDescription('Текст сообщения')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('title')
                .setDescription('Заголовок (для embed)')
                .setRequired(false)
        ),


    async execute(interaction: ChatInputCommandInteraction) {
        if(!(interaction.member?.user.id === interaction.guild?.ownerId)) return interaction.reply('У вас недостаточно прав.');

        const sayEmbed = new EmbedBuilder()
            .setDescription(`${interaction.options.getString('message')}`)
            .setColor(0x0080ff)

        if (interaction.options.getString('title') !== null) {
            sayEmbed.setTitle(`${interaction.options.getString('title')}`);
        }

        if (interaction.options.getBoolean('useembed')) {
            interaction.channel?.send({ embeds: [sayEmbed] });
        } else {
            interaction.channel?.send(`${interaction.options.getString('message')}`);
        }

        await interaction.reply({ content: 'Отправлено.', ephemeral: true });
    }
}