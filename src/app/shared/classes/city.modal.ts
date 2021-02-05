import { ICity } from "../interfaces/city.interface";

export class City implements ICity {
    constructor(
        public id: string,
        public name: string,
        public date: Date,
    ){}
}