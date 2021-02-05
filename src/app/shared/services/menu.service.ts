import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IMenu } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private dbPath = '/menu';
  menuRef: AngularFirestoreCollection<IMenu> = null;

  constructor(private db: AngularFirestore) {
    this.menuRef = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<IMenu> {
    return this.menuRef;
  }

  create(category: IMenu): any {
    return this.menuRef.add({ ...category });
  }

  update(id: string, data: any): Promise<void> {
    return this.menuRef.doc(id).update({ ...data });
  }

  delete(id: string): Promise<void> {
    return this.menuRef.doc(id).delete();
  }
}
