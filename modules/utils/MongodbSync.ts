import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const serverSchema = new Schema({
    id: String,
    administration: [String],
    moderation: [String],
    exceptions: [String],
    listeners: [{
        channel: String,
        message: String,
        reaction: String,
        role: String
    }],
    greeting: {
        enabled: Boolean,
        channelId: String,
        userAddText: String,
        userRemoveText: String,
        addAttachment: String,
        removeAttachment: String
    }
});

const Server = model('Server', serverSchema);

export default Server;