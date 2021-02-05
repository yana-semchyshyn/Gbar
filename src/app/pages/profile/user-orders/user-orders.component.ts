import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {

  CURRENT_USER: any = null;
  isOrderMessage: boolean = false;
  userOrders: Array<IOrder> = [];
  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getLocalUser();
    this.showOrderMessage();
  }

  getLocalUser(): void {
    if (localStorage.getItem('user') != null) {
      this.CURRENT_USER = JSON.parse(localStorage.getItem('user'));
      this.orderService.checkOrders(this.CURRENT_USER.orders);
      this.userOrders = this.orderService.userOrders;
    }
  }

  showOrderMessage(): void{
    if (this.authService.userOrders) this.isOrderMessage = true;
  }

  closeErrorBox(): void{
    this.isOrderMessage = false;
    this.authService.resetUserOrders();
  }

}