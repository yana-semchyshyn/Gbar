import { IGbar } from "../interfaces/gbars.interface";
import { IMenu } from "../interfaces/menu.interface";
import { IOrder } from "../interfaces/order.interface";

export class Order implements IOrder {
    constructor(
        public gbar: IGbar,
        public services: Array<IMenu>,
        public date: Date,
        public firstLastName: string,
        public phone: string,
        public totalPrice: number,
        public totalTime: string,
        public comments: string = ''
    ){}
}