import { ICity } from "../interfaces/city.interface";
import { IGbar } from "../interfaces/gbars.interface";
import { IService } from "../interfaces/service.interface";

export class Gbar implements IGbar {
    constructor(
        public id: string,
        public city: ICity,
        public name: string,
        public icon: string,
        public address: string,
        public phoneNumber: string,
        public services: Array<IService>,
        public date: Date
    ){}
}