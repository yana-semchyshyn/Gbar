import { IOrder } from "../interfaces/order.interface";
import { IProfile } from "../interfaces/profile.interface";

export class Profile implements IProfile {
    public role: string;
    constructor(
        public phoneNumber: string = '',
        public city: string = '',
        public firstLastName: string = '',
        public birthday: Date = null,
        public email: string,
        public orders: Array<IOrder> = [],
    ){
        this.role = 'user';
    }
}