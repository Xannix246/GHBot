import { Client, Events } from "discord.js";
import { Data } from "global";
import request from "request";
const url = 'http://localhost:5001/api/v1/generate';
const data: Data = require('../../data/data.json');
let alreadyWorks = new Set();

const aiModule = async (client: Client) => {
    client.on(Events.MessageCreate, async (message) => {
        if (message.content.includes(data.ClientId)) {
            if (alreadyWorks.has(message.author.id)) {
                message.reply("Диалог уже запущен");
                return;
            }
            alreadyWorks.add(message.author.id);
            message.reply("Собсна, следующие сообщения от вас будут учитываться в контексте бота.");

            let collectedDB: string = '';

            collectedDB = `[The following is an interesting chat message log between You (aka ${message.author.displayName}) and BoyKisser (bot).]\n\nYou: Привет, хочу с тобой пообщаться. Пиши всё чётко, без непоняток.\nBoyKisser: Здравствуй, хорошо.\nYou: `;
            const filter = (m: any) => m.author.id == message.author.id || m.author.id == client?.user?.id,
                messages = message.channel.createMessageCollector({ filter, time: 1200000 });

            await messages.on('collect', async (m: any) => {
                if (m.channel != message.channel) return;
                if (m.content.toLowerCase() == "стоп" || m.content.toLowerCase() == 'stop') {
                    messages.stop();
                    alreadyWorks.delete(message.author.id);
                    return m.reply('Остановлено, собсна');
                }
                if (m.author.id == message.author.id) {
                    collectedDB = collectedDB + `${m.content.replaceAll(`<@${data.ClientId}>`, '')}\nBoyKisser: `;
                }

                if (m.author.bot) return;
                const originalMessage = await m.reply("Минутку...");

                try {
                    await request.post({
                        url: url,
                        json: { "n": 1, 
                        "max_context_length": 2048, 
                        "max_length": 256, 
                        "rep_pen": 1.1, 
                        "temperature": 1.23, 
                        "top_p": 0.8, 
                        "top_k": 40, 
                        "top_a": 0, 
                        "typical": 0.19, 
                        "tfs": 1, 
                        "rep_pen_range": 1024, 
                        "rep_pen_slope": 0.7, 
                        "sampler_order": [6, 0, 1, 3, 4, 2, 5], 
                        "memory": "", 
                        "genkey": "KCPP4933", 
                        "min_p": 0, 
                        "dynatemp_range": 0, 
                        "dynatemp_exponent": 1, 
                        "smoothing_factor": 0, 
                        "banned_tokens": [], 
                        "render_special": false, 
                        "presence_penalty": 0, 
                        "logit_bias": {}, 
                        "prompt": collectedDB, 
                        "quiet": true, 
                        "stop_sequence": ["You:", "\nYou ", "\nBoyKisser: "], 
                        "use_default_badwordsids": false, 
                        "bypass_eos": false 
                    }
                    }, async (err, responce, body) => {
                        if (err) return console.log(err);
                        console.log(responce.body)
                        originalMessage.edit(responce.body.results[0].text.replaceAll('\nYou:', '').replaceAll('\nBoyKisser:', '')).then(
                            collectedDB = collectedDB + `${responce.body.results[0].text.replaceAll('\nYou:', '').replaceAll('\nBoyKisser:', '')}\nYou: `
                        )
                        console.log(collectedDB)
                    })
                } catch (err) {
                    console.log(err);
                    messages.stop();
                    alreadyWorks.delete(message.author.id);
                    originalMessage.edit("Произошла ошибка, диалог будет закрыт.");
                }
            })

            messages.on('end', async () => {
                alreadyWorks.delete(message.author.id);
            })
        }
    })
}

export default aiModule;