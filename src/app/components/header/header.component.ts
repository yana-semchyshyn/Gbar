import { Component, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { map } from 'rxjs/operators';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { IGbar } from 'src/app/shared/interfaces/gbars.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CityService } from 'src/app/shared/services/city.service';
import { GbarsService } from 'src/app/shared/services/gbars.service';
import { ServicesService } from 'src/app/shared/services/services.service';
import * as moment from 'moment';
import 'moment-duration-format';
import { IService } from 'src/app/shared/interfaces/service.interface';
import { IMenu } from 'src/app/shared/interfaces/menu.interface';
import { IOrder } from 'src/app/shared/interfaces/order.interface';
import { Order } from 'src/app/shared/classes/order.modal';
import { OrderService } from 'src/app/shared/services/order.service';
import Telegram from 'telegram-send-message';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cities: Array<ICity>;
  city: ICity;
  gbarName: string;
  currentGbars: Array<IGbar>;
  currentGbar: IGbar;
  chosenGbar: IGbar;
  currentCategories: Array<IService>;
  chosenCategories: Array<IService> = [];
  chosenServices: Array<IMenu> = [];
  order: IOrder;
  email: string;
  password: string;
  phoneNumber: string;
  cityName: string;
  firstLastName: string;
  dateOfBirthday: Date;
  comment: string = '';
  CURRENT_USER: any = null;
  isUser: boolean = false;
  isUserBirthday: boolean = false;
  isLoginModal: boolean = false;
  isOnlineOrderModal: boolean = false;
  isChooseGBar: boolean = false;
  isChooseCategory: boolean = false;
  isChooseServices: boolean = false;
  isSendOrder: boolean = false;
  isNotSelectCategory: boolean = false;
  isNotSelectService: boolean = false;
  isNotValidSignInData: boolean = false;
  isNotValidSignUpData: boolean = false;
  isNotValidEmail: boolean = false;
  isNotValidOrderForm: boolean = false;
  isLogin: boolean = true;
  isPassword: boolean = false;
  isOpened: boolean = false;
  isModal: boolean = false;
  isFirst: boolean;
  isLast: boolean;
  gbarCheckbox: any;
  servicesCheckbox: any;
  date: Date;
  textDecoration: string;
  phoneRegExp = /^\+?3?8?(0[5-9][0-9]\d{7})$/;
  cityRegExp = /^[а-яґєіїА-ЯҐЄІЇa-zA-Z]{1,}$/;
  nameRegExp = /^[а-яґєіїА-ЯҐЄІЇa-zA-Z]{1,}\s[а-яґєіїА-ЯҐЄІЇa-zA-Z]{2,}$/;
  emailRegExp = /^[a-zA-z\d\.-]+@[a-z]+\.[a-z]{2,6}$/;
  passwordRegExp = /^[\d\.-_a-zA-Z]{4,16}$/;
  duration = '00:00';
  totalPrice: number = 0;
  durationArray: Array<string> = [];

  slideConfigSerDetails = {
    "slidesToShow": 1, "slidesToScroll": 1,
    'nextArrow': '.next',
    'prevArrow': '.prev',
    "infinite": false,
    "variableWidth": true,
    'arrows': false,
    "dots": false,
    "speed": 0,
  };

  constructor(private servicesService: ServicesService, private cityService: CityService, private gbarsService: GbarsService,
    private authService: AuthService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.getLocalGbar();
    this.getCities();
    this.validData();
    this.openServiceDetails();
    this.checkLocalUser();
    this.checkUserLogin();
  }

  @ViewChild('slickServiceModal') slickServiceModal: SlickCarouselComponent;

  getCities(): void {
    this.cityService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.cities = data;
    });
  }

  getLocalGbar(): void {
    this.gbarsService.localGbar.subscribe(() => {
      this.currentGbar = JSON.parse(localStorage.getItem('gbar'));
    })
  }

  setCity(): void {
    this.city = this.cities.filter(city => city.name === this.cityName)[0];
  }

  checkLocalUser(): void {
    if (localStorage.getItem('user')) {
      this.CURRENT_USER = JSON.parse(localStorage.getItem('user'));
      if (this.CURRENT_USER.role === 'user') {
        this.isUser = true;
        this.checkUserBirthday();
        this.firstLastName = this.CURRENT_USER.firstLastName;
        this.phoneNumber = this.CURRENT_USER.phoneNumber;
      } else {
        this.isUser = false;
      }
    }
    else {
      this.isUser = false;
    }
  }

  signUp(): void {
    if (this.dataValidation()) {
      this.authService.signUp(this.phoneNumber, this.cityName, this.firstLastName, this.dateOfBirthday, this.email, this.password);
    }
    else this.isNotValidSignUpData = true;
  }

  signIn(): void {
    if (this.email && this.password) {
      this.authService.signIn(this.email, this.password);
    }
  }

  checkUserLogin(): void {
    this.authService.checkSignIn.subscribe(() => {
      this.checkLocalUser();
      this.loginModalStatus(false);
      this.resetForm();
    });
  }

  checkUserBirthday(): void {
    if (this.isUserBirthday = this.authService.checkUserBirthday(this.CURRENT_USER)) {
      this.textDecoration = 'line-through';
    }
    else this.textDecoration = 'none';
  }

  dataValidation(): boolean {
    if (this.phoneRegExp.test(this.phoneNumber) && this.cityRegExp.test(this.cityName) && this.nameRegExp.test(this.firstLastName)
      && ((new Date().getFullYear() - new Date(this.dateOfBirthday).getFullYear()) >= 16) && this.emailRegExp.test(this.email) && this.passwordRegExp.test(this.password)) return true;
    else return false;
  }

  validData(): void {
    this.authService.notValidSignInData.subscribe(() => {
      this.isNotValidSignInData = true;
    })
    this.authService.notValidSignUpData.subscribe(() => {
      this.isNotValidEmail = true;
    })
  }

  chooseGbar(gbar: IGbar): void {
    this.chosenGbar = gbar;
    this.gbarName = this.chosenGbar.name;
    this.currentCategories = gbar.services;
    this.isChooseGBar = false;
    this.isChooseCategory = true;
    this.currentCategories.forEach((element, i) => {
      if (element.name == 'Сертифікати') this.currentCategories.splice(i, 1);
    });
    setTimeout(() => {
      this.gbarCheckbox = document.querySelectorAll('.chosen-category');
    }, 2);
  }

  selectCategory(i: number, category: IService): void {
    if (this.gbarCheckbox[i].style.display == 'none') {
      this.chosenCategories.push(category);
      this.gbarCheckbox[i].style.display = 'block';
    }
    else {
      this.chosenCategories.forEach((element, index) => {
        if (element.name == category.name) this.chosenCategories.splice(index, 1);
      });
      this.gbarCheckbox[i].style.display = 'none';
    }
  }

  selectService(service: IMenu): void {
    this.servicesCheckbox.forEach(element => {
      if (element.firstChild.textContent == service.name && element.style.backgroundColor == 'transparent') {
        this.chosenServices.push(service);
        element.style.backgroundColor = '#ffeef6';
      }
      else if (element.firstChild.textContent == service.name) {
        this.chosenServices.forEach((variable, index) => {
          if (variable.name == service.name) this.chosenServices.splice(index, 1);
        });
        element.style.backgroundColor = 'transparent';
      }
    });
    this.getTotalInfo(this.chosenServices);
  }

  calcTime(services): void {
    let h = 0;
    let m = 0;
    this.duration = '';
    services.forEach(element => this.durationArray.push(element.time));
    this.durationArray.forEach(element => {
      h += +element.slice(0, (element.indexOf(':')));
      m += +element.slice(element.indexOf(':') + 1);
    });
    if (moment.duration(m, "minutes").format("h:mm").indexOf(':') != -1) {
      h += +moment.duration(m, "minutes").format("h:mm").slice(0, moment.duration(m, "minutes").format("h:mm").indexOf(':'));
      m = +moment.duration(m, "minutes").format("h:mm").slice(moment.duration(m, "minutes").format("h:mm").indexOf(':') + 1);
    }
    this.checkTime(h, m);
  }

  checkTime(h, m): void {
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    this.duration = `${h}:${m}`;
  }

  getTotal(services: Array<IMenu>, discount: boolean): number {
    if (!discount) return services.reduce((total, service) => total + service.price, 0);
    else return services.reduce((total, service) => total + +(service.price * 90 / 100).toFixed(), 0);
  }

  getTotalInfo(services: Array<IMenu>): void {
    this.totalPrice = 0;
    this.durationArray = [];
    if (services.length > 0) {
      this.calcTime(services);
      this.totalPrice = this.getTotal(services, this.isUserBirthday);
    }
    else this.duration = '00:00';
  }

  createOrder(): void {
    if (this.isUserBirthday) {
      this.chosenServices.forEach(element => {
        element.price = +(element.price * 90 / 100).toFixed();
      });
    }
    if (((new Date(this.date).getDate() >= new Date().getDate() && new Date(this.date).getMonth() >= new Date().getMonth()) ||
    (new Date(this.date).getDate() < new Date().getDate() && new Date(this.date).getMonth() > new Date().getMonth())) && 
    this.nameRegExp.test(this.firstLastName) && this.phoneRegExp.test(this.phoneNumber)   ) {
      const order = new Order(
        this.chosenGbar,
        this.chosenServices,
        this.date,
        this.firstLastName,
        this.phoneNumber,
        this.totalPrice,
        this.duration,
        this.comment);
      this.orderService.create(order).then(
        () => {
          if (this.isUser) {
            this.CURRENT_USER = JSON.parse(localStorage.getItem('user'));
            this.CURRENT_USER.orders.push({ ...order });
            this.authService.updateUserData(this.CURRENT_USER.id, this.CURRENT_USER).then(
              () => {
                this.updateLocal();
                this.checkLocalUser();
                this.sendDataToTelegram();
                this.authService.goToUserOrders();
                this.resetOrderModal();
              }
            )
          }
        })
    }
    else this.isNotValidOrderForm = true;
  }

  updateLocal(): void {
    const local = {
      ...this.CURRENT_USER,
    }
    localStorage.setItem('user', JSON.stringify(local));
  }

  sendDataToTelegram(): void {
    let services = '';
    let smiley;
    if (this.isUserBirthday) smiley = '🥳';
    else smiley = '👋';
    this.chosenServices.forEach(element => {
      services += '—' + ' ' + `${element.name}` + '%0A';
    });
    Telegram.setToken('1480206103:AAHbY-CLU1uaLPPoSr8b_2MWZtC-8I0vdmU');
    Telegram.setRecipient('-388574814');
    Telegram.setMessage(`🎀 ${this.gbarName.toUpperCase()}%0A${this.firstLastName} ${smiley}%0A📞 ${this.phoneNumber}%0A📆 ${this.date}%0A${services}💰${this.totalPrice} грн%0A%0AКоментар:%0A${this.comment}`);
    Telegram.send();
  }

  afterChange(e): void {
    if (e.currentSlide == 0) this.isFirst = true;
    else this.isFirst = false;
    if (e.currentSlide === e.slick.slideCount - 1) this.isLast = true;
    else this.isLast = false;
  }

  next(): void {
    this.slickServiceModal.slickNext();
  }

  prev(): void {
    this.slickServiceModal.slickPrev();
  }

  hideScroll(): void {
    document.querySelector('body').style.overflow = 'hidden';
  }

  showScroll(): void {
    document.querySelector('body').style.overflow = 'visible';
  }

  showPassword(): void {
    this.isPassword = !this.isPassword;
  }

  openMobileMenu(): void {
    this.isOpened = true;
    this.hideScroll();
  }

  closeMobileMenu(): void {
    this.isOpened = false;
    this.showScroll();
  }

  loginModalStatus(status: boolean): void {
    if (status) {
      this.isLoginModal = true;
      this.hideScroll();
    }
    else if (!this.isLogin) {
      this.isLogin = true;
      this.hideScroll();
    }
    else {
      this.showScroll();
      this.isLoginModal = false;
    }
  }

  openSignUpBox(): void {
    this.isLogin = false;
  }

  onlineOrderModalStatus(status: boolean): void {
    if (status && this.isUser) {
      this.currentGbars = this.gbarsService.currentGbars;
      this.currentGbar = this.gbarsService.currentGbar;
      this.cityName = this.currentGbar.city.name;
      this.isOnlineOrderModal = true;
      this.isChooseGBar = true;
      this.hideScroll();
    }
    else if (status && !this.isUser) this.loginModalStatus(true);
    else {
      this.isOnlineOrderModal = false;
      this.isChooseCategory = false;
      this.isChooseServices = false;
      this.isSendOrder = false;
      this.resetOrderModal();
      this.showScroll();
    }
  }

  goToOrderForm(): void {
    if (this.chosenServices.length == 0) this.isNotSelectService = true;
    else {
      this.isChooseServices = false;
      this.isSendOrder = true;
    }
  }

  backToCategories(): void {
    let gbarBoxes;
    this.isChooseCategory = true;
    this.isChooseServices = false;
    this.resetChooseServices();
    setTimeout(() => {
      this.gbarCheckbox = document.querySelectorAll('.chosen-category');
      gbarBoxes = document.querySelectorAll('.select-box');
      gbarBoxes.forEach((element, i) => {
        this.chosenCategories.forEach(variable => {
          if (variable.name == element.lastChild.textContent) this.gbarCheckbox[i].style.display = 'block';
        });
      });
    }, 2);
  }

  goBack(): void {
    if (this.isChooseCategory == true) {
      this.isChooseCategory = false;
      this.isChooseGBar = true;
      this.chosenCategories = [];
    }
    if (this.isChooseServices == true) this.backToCategories();
    if (this.isSendOrder == true) {
      this.isSendOrder = false;
      this.isChooseServices = true;
      this.resetChooseServices();
      setTimeout(() => {
        this.servicesCheckbox = document.querySelectorAll('.services');
      }, 2);
    }
  }

  openServiceDetails(): void {
    this.servicesService.serviceDetails.subscribe(() => {
      this.isModal = true;
      this.hideScroll();
      this.currentGbar = JSON.parse(localStorage.getItem('gbar'));
      setTimeout(() => {
        if (this.servicesService.serviceNumber >= 0) this.slickServiceModal.slickGoTo(this.servicesService.serviceNumber);
      }, 2);
    })
  }

  closeModal(): void {
    this.isModal = false;
    this.showScroll();
  }

  goToServices(): void {
    if (this.chosenCategories.length > 0) {
      this.isChooseCategory = false;
      this.isChooseServices = true;
      setTimeout(() => {
        this.servicesCheckbox = document.querySelectorAll('.services');
      }, 2);
    }
    else this.isNotSelectCategory = true;
  }


  closeErrorBox(): void {
    this.isNotSelectCategory = false;
    this.isNotValidSignInData = false;
    this.isNotValidSignUpData = false;
    this.isNotValidEmail = false;
    this.isNotSelectService = false;
    this.isNotValidOrderForm = false;
  }

  resetForm(): void {
    this.email = '';
    this.password = '';
    this.phoneNumber = '';
    this.cityName = '';
    this.firstLastName = '';
    this.dateOfBirthday = null;
    this.closeErrorBox();
  }

  resetOrderModal(): void {
    this.comment = '';
    this.date = null;
    this.gbarName = '';
    this.totalPrice = 0;
    this.duration = '00:00';
    this.chosenServices = [];
    this.chosenCategories = [];
    this.chosenGbar = null;
    this.closeErrorBox();
  }

  resetChooseServices(): void {
    this.chosenServices = [];
    this.duration = '00:00';
    this.totalPrice = 0;
  }
}