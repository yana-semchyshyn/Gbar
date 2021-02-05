import { IMenu } from "../interfaces/menu.interface";
import { IService } from "../interfaces/service.interface";

export class Service implements IService {
    constructor(
        public id: string,
        public name: string,
        public icon: string,
        public contentFirstImg: string,
        public contentSecondImg: string,
        public btnColor: string,
        public menu : Array<IMenu> = []
    ){}
}