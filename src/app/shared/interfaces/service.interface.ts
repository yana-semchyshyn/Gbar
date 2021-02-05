import { IMenu } from "./menu.interface";

export interface IService{
    id: string;
    name: string;
    icon: string;
    contentFirstImg: string;
    contentSecondImg: string;
    btnColor: string;
    menu: Array<IMenu>;
}