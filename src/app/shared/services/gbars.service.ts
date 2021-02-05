import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ICity } from '../interfaces/city.interface';
import { IGbar } from '../interfaces/gbars.interface';

@Injectable({
  providedIn: 'root'
})
export class GbarsService {
  currentGbar: IGbar;
  currentGbars: Array<IGbar>;
  localGbar: Subject<boolean> = new Subject();
  private dbPath = '/gbars';
  gbarsRef: AngularFirestoreCollection<IGbar> = null;

  constructor(private db: AngularFirestore) {
    this.gbarsRef = this.db.collection(this.dbPath);
  }

  getCurrentGbars(city: string, gbars: Array<IGbar>): void {
    this.currentGbars = gbars.filter(function (gbar) {
      return gbar.city.name == city;
    });
    if (this.currentGbars.length > 0){
      this.currentGbar = this.currentGbars[0];
      this.updateLocalGbar(this.currentGbar);
    } 
  }

  getCurrentGbar(cities: Array<ICity>, gbars: Array<IGbar>): void {
    if (localStorage.getItem('city') == null && cities.length > 0) {
      this.getCurrentGbars(cities[0].name, gbars);
      this.updateLocalGbar(this.currentGbar);
    }
    else if (localStorage.getItem('city')){
      let city = JSON.parse(localStorage.getItem('city'));
      this.getCurrentGbars(city, gbars);
      this.updateLocalGbar(this.currentGbar);
    };
  }

  updateLocalGbar(gbar: IGbar): void {
    localStorage.setItem('gbar', JSON.stringify(gbar));
    this.localGbar.next(true);
  }

  getAll(): AngularFirestoreCollection<IGbar> {
    return this.gbarsRef;
  }

  create(gbar: IGbar): Promise<DocumentReference<IGbar>> {
    return this.gbarsRef.add({...gbar});
  }

  update(id: string, data: any): Promise<void> {
    return this.gbarsRef.doc(id).update({...data});
  }

  delete(id: string): Promise<void> {
    return this.gbarsRef.doc(id).delete();
  }
}