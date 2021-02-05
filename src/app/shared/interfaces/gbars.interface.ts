import { ICity } from "./city.interface";
import { IService } from "./service.interface";

export interface IGbar{
    id: string;
    city: ICity;
    name: string;
    icon: string;
    address: string;
    phoneNumber: string;
    services: Array<IService>;
    date: Date
}