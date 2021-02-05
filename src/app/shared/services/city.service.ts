import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ICity } from '../interfaces/city.interface';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private dbPath = '/cities';
  citiesRef: AngularFirestoreCollection<ICity> = null;

  constructor(private db: AngularFirestore) {
    this.citiesRef = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<ICity> {
    return this.citiesRef;
  }

  create(category: ICity): any {
    return this.citiesRef.add({ ...category });
  }

  update(id: string, data: any): Promise<void> {
    return this.citiesRef.doc(id).update({ ...data });
  }

  delete(id: string): Promise<void> {
    return this.citiesRef.doc(id).delete();
  }
}