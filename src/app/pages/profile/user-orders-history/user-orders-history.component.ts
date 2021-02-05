import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-user-orders-history',
  templateUrl: './user-orders-history.component.html',
  styleUrls: ['./user-orders-history.component.scss']
})
export class UserOrdersHistoryComponent implements OnInit {
  CURRENT_USER: any = null;
  userOrdersHistory: Array<IOrder> = [];
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getLocalUser();
  }

  getLocalUser(): void {
    if (localStorage.getItem('user') != null) {
      this.CURRENT_USER = JSON.parse(localStorage.getItem('user'));
      this.orderService.checkOrders(this.CURRENT_USER.orders);
      this.userOrdersHistory = this.orderService.userOrdersHistory;
    }
  }

}
