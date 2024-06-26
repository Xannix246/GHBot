import { Client, EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder, version, Collection } from "discord.js";
import os from "os";
import moment from "moment";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resmon')
        .setDescription('Статистика мо железу'),

    async execute(interaction: ChatInputCommandInteraction, commandsData: Collection<unknown, unknown>, client: Client) {
        let platform = "";
        switch (os.platform()) {
            case "win32":
                platform = `Windows (${os.release()})`;
                break;
            case "android":
                platform = `Android + Termux (${os.release()})`;
                break;
            case "linux":
                platform = `Linux (${os.release()})`;
                break;
            default:
                platform = `Неопознанная платформа`;
                break;
        }

        let clienthealth;
        client.ws.ping > 1500 ?
            clienthealth = "Бот работает в онлайне, но ответит с большой задержкой." :
            clienthealth = "Бот работает в онлайне, оптимальная задержка.";

        const uptime = moment.duration(client.uptime);
        const days = Math.floor(uptime.asDays());
        const hours = uptime.hours();
        const minutes = uptime.minutes();
        const seconds = uptime.seconds();

        const embed = new EmbedBuilder()
            .setTitle("Монитор ресурсов бота.")
            .setColor(0x0080ff)
            .addFields(
                { name: 'Память', value: `Используемая память: ${Math.round(process.memoryUsage().heapUsed / 1048576)} мегабайт (${Math.round(process.memoryUsage().heapUsed / 1024)} килобайт)` },
                { name: 'Время', value: `Время отправки: ${client.ws.ping.toFixed(2)} миллисекунд \nВремя работы: ${days} д. ${hours} ч. ${minutes} мин. ${seconds} сек.` },
                { name: 'Статистика', value: `Серверов: ${client.guilds.cache.size}\nУчастников: ${client.users.cache.size}` },
                { name: 'Платформа', value: `Операционная система: ${platform}` },
                { name: 'Системная ~~шоколадка~~ информация', value: `Процессор: ${os.cpus()[0]?.model || 'Неизвестно'}\nВерсия Node.js: ${process.version}\nВерсия Discord.js: ${version}` },
                { name: 'Качество отправки', value: `${clienthealth} (${client.ws.ping} миллисекунд)` },
                { name: 'Команды', value: `Общее кол-во команд бота: ${commandsData.size} команд` }
            )
            .setTimestamp()
        interaction.reply({ embeds: [embed] });

    }
}
