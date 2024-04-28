import { Interaction } from "discord.js";
import Server from "./MongodbSync";
import mongoose from "mongoose";

const DBSync = async (interaction: Interaction) => {
    const ServerModel = mongoose.model('Server');
    const serverDb = await ServerModel.exists({ id: interaction.guildId });
    const getServerDb = await ServerModel.find({ id: interaction.guildId });

    if (serverDb === null) {
        const serverPush = new Server({
            id: interaction.guildId,
            administration: [],
            moderation: [],
            listeners: [],
            greeting: {
                enabled: false,
                channelId: "",
                userAddText: "",
                userRemoveText: "",
                addAttachment: "",
                removeAttachment: ""
            }
        })

        await serverPush.save().then(() => {
            return getServerDb;
        })
    } else {
        return getServerDb;
    }
}

export default DBSync;