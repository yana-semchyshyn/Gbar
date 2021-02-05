import { IMenu } from "../interfaces/menu.interface";

export class Menu implements IMenu {
    constructor(
        public id: string,
        public name: string,
        public time: string,
        public price: number = 0,
    ){}
}