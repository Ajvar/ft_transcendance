import { User } from "src/database/entities/User";

// done type for serializer
export type Done = (err: Error, user: User) => void;

// user details for db query
export type UserDetails = {
    username: string;
    email: string;
    id42: number;
    img_url: string;
}

export type NotifData = {
    header: string,
    body: string, 
    accept: string,
    decline: string,
    from: User,
    to: User,
    acceptEvent: string,
    declineEvent?: string,
}