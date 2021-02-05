import { IGbar } from '../interfaces/gbars.interface';
import { IMenu } from './menu.interface';

export interface IOrder {
    gbar: IGbar;
    services: Array<IMenu>;
    date: Date;
    firstLastName: string;
    phone: string;
    totalPrice: number;
    totalTime: string;
    comments: string;
}