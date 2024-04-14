export interface Roles extends Array<string> {
    moderation: string[],
    administration: string[]
}

export interface ListenMessage extends Array<string> {
    channel: string;
    message: string;
    reaction: string;
    role: string;
}

export interface GreetingUser extends Array<string> {
    enabled: boolean;
    userAddText: string;
    userRemoveText: string;
    channelId: string;
    addAttachment: string;
    removeAttachment: string;
}