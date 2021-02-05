import { ICity } from "./city.interface";

export interface IVacancy{
    id: string;
    city: ICity;
    name: string;
    contentFirstImg: string;
    contentSecondImg: string;
    description: string;
}
