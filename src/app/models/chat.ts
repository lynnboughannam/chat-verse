import { Timestamp } from "@angular/fire/firestore";
import { UserProfile } from "./user-profile";



export interface Chat {
    id: string;
    lastMessage?: string;
    lastMessageDate?: Date & Timestamp;
    userIds: string[];
    users: UserProfile[];

    chatPic?: string,
    chatName?: string

}

export interface Message {
    text: string;
    senderId: string;
    sentDate: Date & Timestamp;
}