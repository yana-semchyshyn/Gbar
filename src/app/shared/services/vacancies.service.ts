import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IVacancy } from '../interfaces/vacancies.interface';

@Injectable({
  providedIn: 'root'
})
export class VacanciesService {
  private dbPath = '/vacancies';
  vacanciesRef: AngularFirestoreCollection<IVacancy> = null;

  constructor(private db: AngularFirestore) {
    this.vacanciesRef = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<IVacancy> {
    return this.vacanciesRef;
  }

  create(category: IVacancy): any {
    return this.vacanciesRef.add({ ...category });
  }

  update(id: string, data: any): Promise<void> {
    return this.vacanciesRef.doc(id).update({ ...data });
  }

  delete(id: string): Promise<void> {
    return this.vacanciesRef.doc(id).delete();
  }
}
