import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const serverSchema = new Schema({
    id: String,
    interserverChannels: [String],
    channels: [{
        id: String,
        token: String
    }]
});

const Server = model('Bot', serverSchema);

const BotDBSync = async () => {
    const ServerModel = mongoose.model('Bot');
    const serverDb = await ServerModel.exists({ id: 1 });
    const getServerDb = await ServerModel.find({ id: 1 });

    if (serverDb === null) {
        const serverPush = new Server({
            id: 1,
            interserverChannels: [],
            channels: []
        })

        await serverPush.save().then(() => {
            return getServerDb;
        })
    } else {
        return getServerDb;
    }
}

export default BotDBSync;