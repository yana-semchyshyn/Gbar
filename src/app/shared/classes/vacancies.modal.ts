import { ICity } from "../interfaces/city.interface";
import { IVacancy } from "../interfaces/vacancies.interface";

export class Vacancy implements IVacancy {
    constructor(
        public id: string,
        public city: ICity,
        public name: string,
        public contentFirstImg: string,
        public contentSecondImg: string,
        public description: string,
    ) { }
}