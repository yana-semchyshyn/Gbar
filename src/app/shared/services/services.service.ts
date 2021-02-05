import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ReplaySubject } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { IService } from '../interfaces/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  serviceDetails: Subject<boolean> = new Subject();
  serviceNumber: number;
  private dbPath = '/services';
  servicesRef: AngularFirestoreCollection<IService> = null;

  constructor(private db: AngularFirestore) {
    this.servicesRef = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<IService> {
    return this.servicesRef;
  }

  create(service: IService): any {
    return this.servicesRef.add({ ...service });
  }

  update(id: string, data: any): Promise<void> {
    return this.servicesRef.doc(id).update({...data});
  }

  delete(id: string): Promise<void> {
    return this.servicesRef.doc(id).delete();
  }

  goTo(i: number): void{
    this.serviceDetails.next(true);
    this.serviceNumber = i;
  }
}