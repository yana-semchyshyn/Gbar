import { IOrder } from "./order.interface";

export interface IProfile {
    phoneNumber: string;
    city: string;
    firstLastName: string;
    birthday: Date;
    email: string;
    orders: Array<IOrder>;
    role: string;
}