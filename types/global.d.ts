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