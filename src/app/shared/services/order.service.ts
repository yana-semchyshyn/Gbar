import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { IOrder } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  userOrders: Array<IOrder>;
  userOrdersHistory: Array<IOrder> = [];
  private dbPath = '/orders';
  ordersRef: AngularFirestoreCollection<IOrder> = null;
  constructor(private db: AngularFirestore) {
    this.ordersRef = this.db.collection(this.dbPath);
  }

  create(order: IOrder): Promise<DocumentReference<IOrder>> {
    return this.ordersRef.add({ ...order });
  }

  checkOrders(userOrders: Array<IOrder>): void {
    this.userOrders = [];
    this.userOrdersHistory = [];
    userOrders.forEach(element => {
      if ((new Date(element.date).getDate() < new Date().getDate() && new Date(element.date).getMonth() <= new Date().getMonth()) || (new Date(element.date).getDate() > new Date().getDate() && new Date(element.date).getMonth() < new Date().getMonth())) this.userOrdersHistory.push(element);
      else this.userOrders.push(element);
    });
  }
}