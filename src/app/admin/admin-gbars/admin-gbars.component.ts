import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { IGbar } from 'src/app/shared/interfaces/gbars.interface';
import { IService } from 'src/app/shared/interfaces/service.interface';
import { Gbar } from 'src/app/shared/classes/gbars.model';
import { ServicesService } from 'src/app/shared/services/services.service';
import { GbarsService } from 'src/app/shared/services/gbars.service';
import { CityService } from 'src/app/shared/services/city.service';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { MenuService } from 'src/app/shared/services/menu.service';
import { IMenu } from 'src/app/shared/interfaces/menu.interface';

@Component({
  selector: 'app-admin-gbars',
  templateUrl: './admin-gbars.component.html',
  styleUrls: ['./admin-gbars.component.scss']
})
export class AdminGbarsComponent implements OnInit {
  services: Array<IService>;
  service: IService;
  serviceID: number | string;
  cities: Array<ICity>;
  currentCity: ICity;
  menu: Array<IMenu>;
  gbars: Array<IGbar>;
  gbar: IGbar;
  gbarID: string;
  gbarCityName: string;
  gbarName: string;
  gbarIcon: string;
  gbarAddress: string;
  gbarPhoneNum: string;
  currentServices: Array<IService> = [];
  currentMenu: Array<IMenu> = [];
  currentMenuItem: IMenu;
  gbarServiceName: string;
  menuItemName: string;
  menuItemPrice: number;
  gbarDate = new Date();
  serviceMenu: any;
  currentMenuItemID: number;

  isAddModal = false;
  isMenuItemBtn = false;
  isClicked = false;
  isMenuItems = false;
  isEdited = false;
  isChecked = false;
  isChekedServiceName = true;
  searchName: string;

  chosenServices: Array<string>;
  modalSM = 'modal-sm modal-dialog-centered';
  modalLG = 'modal-lg modal-dialog-centered';
  modalCenter = 'modal-dialog-centered'
  checkModel: any = { left: false, middle: true, right: false };
  modalRef: BsModalRef;

  constructor(private gbarsService: GbarsService,
    private servicesService: ServicesService,
    private citiesService: CityService,
    private menuService: MenuService,
    private storage: AngularFireStorage,
    private modalService: BsModalService) {
  }

  ngOnInit(): void {
    this.getCities();
    this.getServices();
    this.getMenu();
    this.getGbars();
  }

  private getCities(): void {
    this.citiesService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.cities = data;
      this.cities.sort((a,b) => a.name > b.name ? 1 : -1);
    });
  }

  private getServices(): void {
    this.servicesService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.services = data;
      this.services.sort((a,b) => a.name > b.name ? 1 : -1);
    });
  }

  private getMenu(): void {
    this.menuService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.menu = data;
      this.menu.sort((a,b) => a.name > b.name ? 1 : -1);
    });
  }

  private getGbars(): void {
    this.gbarsService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.gbars = data;
    });
  }

  setCity(): void {
    this.currentCity = this.cities.filter(city => city.name === this.gbarCityName)[0];
  }

  checkGbar(): void {
    this.isChecked = false;
    if (this.currentCity == undefined || this.gbarName == '' || this.gbarIcon == '' || this.gbarAddress == '' || this.gbarPhoneNum == '' ||
    this.currentServices.length == 0) this.isChecked = true;
  }

  addGbar(): void {
    this.checkGbar();
    if (!this.isChecked) {
      const newGbar = new Gbar('oo', this.currentCity, this.gbarName, this.gbarIcon, this.gbarAddress, this.gbarPhoneNum, this.currentServices, this.gbarDate);
      delete newGbar.id;
      this.gbarsService.create(newGbar).then(() => {
        this.openModal(false);
        this.resetForm();
      });
    }    
  }

  addCategory(): void{
    this.service = this.services.filter(service => service.name === this.gbarServiceName)[0];
    this.service.menu = this.currentMenu;
    this.currentServices.push(this.service);
    this.getCurrentMenuItems();
    this.currentMenu = [];
    this.gbarServiceName = '';
    this.isMenuItems = false;
  }

  addMenuItem(): void{   
    this.currentMenuItem = this.menu.filter(menu => menu.name === this.menuItemName)[0];
    if (this.currentMenuItem != undefined){
      this.currentMenuItem.price = this.menuItemPrice;      
      if (this.currentMenuItem.price != undefined){
        this.currentMenu.push(this.currentMenuItem);
        this.menuItemName = '';
        this.menuItemPrice = null;
        this.isMenuItems = true;
      }
    }
  }

  deleteChosenMenuItem(i: number): void{
    this.currentMenu.splice(i, 1)
  }

  deleteChosenService(i: number): void{
    this.currentServices.splice(i, 1);
  }

  menuStatus(): void{
    this.isClicked = !this.isClicked;
  }

  editCategory(i: number): void {
    this.isMenuItems = true;
    this.isMenuItemBtn = true;
    this.currentMenuItemID = i;
    this.currentServices[i].menu.forEach(element => {
      this.currentMenu.push(element);
    });
    this.gbarServiceName = this.currentServices[i].name;
    this.currentServices[i].menu = [];
  }

  updateCategory(): void{
    this.currentServices.forEach(element => {
      if (element.name == this.gbarServiceName){
        this.currentMenu.forEach(variable => {
          element.menu.push(variable);
        });
      }
    });
    this.currentMenu = [];
    this.gbarServiceName = '';
    this.isMenuItems = false;
    this.isMenuItemBtn = false;
    this.getCurrentMenuItems();
    this.showCertainMenu(this.currentMenuItemID);
    this.currentMenuItemID = null;
  }

  getGbar(gbar: IGbar): void {
    this.gbar = gbar;
  }

  deleteGbar(gbar: IGbar): void {
    this.gbarsService.delete(gbar.id)
      .catch(err => console.log(err));
    this.getGbars();
  }

  editGbar(gbar: IGbar): void {
    this.gbarID = gbar.id;
    this.currentCity = gbar.city;
    this.gbarCityName = this.currentCity.name;
    this.gbarName = gbar.name;
    this.gbarIcon = gbar.icon;
    this.gbarAddress = gbar.address;
    this.gbarPhoneNum = gbar.phoneNumber;
    this.currentServices = gbar.services;
    this.isEdited = true;
  }

  updateGbar(): void {
    this.checkGbar();
    if (!this.isChecked) {
      const updService = new Gbar(this.gbarID, this.currentCity, this.gbarName, this.gbarIcon, this.gbarAddress, this.gbarPhoneNum, this.currentServices, this.gbarDate);
      this.gbarsService.update(updService.id, updService)
        .catch(err => console.log(err));
      this.openModal(false);
      this.resetForm();
      this.openModal(false);
      this.isEdited = false;
      this.isChecked = false;
    }
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    upload.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.gbarIcon = url;
      });
    });
  }

  openDeleteModal(template: TemplateRef<any>, modalStyle): void {
    const config: ModalOptions = { class: `${modalStyle}`};
    this.modalRef = this.modalService.show(template, config);
  }

  openModal(status: boolean): void {
    if (status){
      this.isAddModal = true;
      this.getCurrentMenuItems();
      document.querySelector('body').style.overflow = 'hidden';
    }
    else{
      this.isAddModal = false;
      document.querySelector('body').style.overflow = 'visible';
    } 
  }

  resetForm(): void {
    this.gbarName = '';
    this.gbarCityName = '';
    this.gbarName = '';
    this.gbarIcon = '';
    this.gbarAddress = '';
    this.gbarPhoneNum = '';
    this.currentServices = [];
    this.gbarServiceName = '';
    if (this.isEdited) this.isEdited = !this.isEdited;
  }
  
  getCurrentMenuItems(): void{
    setTimeout(() => {
      this.serviceMenu = document.querySelectorAll('ul');        
    }, 2);
  }

  showCertainMenu(i: number): void{
    if (this.serviceMenu[i].style.display == 'none') this.serviceMenu[i].style.display = 'block';
    else this.serviceMenu[i].style.display = 'none';
  }

}

