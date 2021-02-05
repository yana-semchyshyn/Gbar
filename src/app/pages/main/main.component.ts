import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { ViewChild } from '@angular/core';
import { IGbar } from 'src/app/shared/interfaces/gbars.interface';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CityService } from 'src/app/shared/services/city.service';
import { GbarsService } from 'src/app/shared/services/gbars.service';
import { ServicesService } from 'src/app/shared/services/services.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  gbars: Array<IGbar> = [];
  cities: Array<ICity> = [];
  cityName: string;
  bgColor: string = '#f3d4dc';
  currentGbars: Array<IGbar> = [];
  currentGbar: IGbar;
  isTimeOut = false;
  isClicked = false;
  isModalClick = false;
  isFirst = true;
  isLast = false;
  isCreateScroll: boolean;
  isAboutScroll: boolean;
  isBarsScroll: boolean;
  isServicesScroll: boolean;
  isFranchiseScroll: boolean;
  modalRef: BsModalRef;

  slideConfigServices = {
    "slidesToShow": 2, "slidesToScroll": 1,
    'arrows': false,
    "dots": false,
    "infinite": false,
    "variableWidth": true,
    'asNavFor': '.slider-nav',
  };

  slideConfigSerMenu = {
    "slidesToShow": 5, "slidesToScroll": 1,
    'asNavFor': '.slider-for',
    'nextArrow': '.btn-next',
    'prevArrow': '.btn-prev',
    "infinite": false,
    "variableWidth": true,
    'arrows': false,
    "dots": false,
  };

  constructor(private gbarsService: GbarsService, private cityService: CityService, 
    private servicesService: ServicesService, private modalService: BsModalService) {
  }

  ngOnInit(): void {
    this.resetScrolls();
    this.getCities();
    this.getGbars();
    this.isFirst = true;
    this.isLast = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let scroll = window.scrollY;
    this.checkScrolls(scroll);
  }

  @ViewChild('slickModal') slickModal: SlickCarouselComponent;

  getCities(): void {
    this.cityService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.cities = data;
      this.chooseCity();
    });
  }

  getGbars(): void {
    this.gbarsService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.gbars = data;
      this.gbarsService.getCurrentGbars(this.cityName, this.gbars);
      this.currentGbars = this.gbarsService.currentGbars;
      this.currentGbar = this.gbarsService.currentGbar;
    });
  }

  changeGbar(GB: string): void {
    let chosenGbar = this.currentGbars.filter(function (gbar) {
      return gbar.name == GB;
    });
    if (chosenGbar.length > 0) {
      this.currentGbar = chosenGbar[0];
      this.gbarsService.updateLocalGbar(this.currentGbar);
    }
  }

  changeCity(city: string): void {
    this.cityName = city;
  }

  onChange(city: string, updateStatus: boolean) {
    this.gbarsService.getCurrentGbars(city, this.gbars);
    this.currentGbars = this.gbarsService.currentGbars;
    this.currentGbar = this.gbarsService.currentGbar;
    this.resetCarousel();
    if (updateStatus) this.updateLocalCity(city);
  }

  chooseCity(): void {
    if (localStorage.getItem('city') == null){
      setTimeout(() => {
        this.isTimeOut = true;
      }, 1000);
      this.hideScroll();
      if (localStorage.getItem('gbar')) this.cityName = JSON.parse(localStorage.getItem('gbar')).city.name;
      else if (this.cities.length > 0) this.cityName = this.cities[0].name;
    }
    else this.cityName = JSON.parse(localStorage.getItem('city'));
  }

  updateLocalCity(city: string): void {
    localStorage.setItem('city', JSON.stringify(city));
  }

  getRandom(): string {
    let min = Math.ceil(190);
    let max = Math.floor(250);
    let r = Math.floor(Math.random() * (max - min + 1)) + min;
    let g = Math.floor(Math.random() * (max - min + 1)) + min;
    let b = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.bgColor = `rgb(${r}, ${g}, ${b})`;
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
    this.hideScroll();
  }

  closeMainModal(): void {
    this.isTimeOut = false;
    this.showScroll();
  }

  menuStatus(status: boolean): void {
    if (status) this.isClicked = !this.isClicked;
    else this.isModalClick = !this.isModalClick;
  }

  hideScroll(): void{
    document.querySelector('body').style.overflow = 'hidden';
  }

  showScroll(): void{
    document.querySelector('body').style.overflow = 'visible';
  }

  afterChange(e): void {
    if (e.currentSlide == 0) this.isFirst = true;
    else this.isFirst = false;
    if (e.currentSlide === e.slick.slideCount - 1) this.isLast = true;
    else this.isLast = false;
  }

  openService(i: number): void {
    this.servicesService.goTo(i);
  }

  goTo(i: number): void {
    this.slickModal.slickGoTo(i);
  }

  next(): void {
    this.slickModal.slickNext();
  }

  prev(): void {
    this.slickModal.slickPrev();
  }

  resetCarousel(): void {
    this.slickModal.slickGoTo(0);
    this.isFirst = false;
    this.isLast = true;
  }

  checkScrolls(number): void {
    if (number > 3) this.isCreateScroll = true;
    if (number > 180) this.isAboutScroll = true;
    if (number > 780) this.isServicesScroll = true;
    if (number > 1638) this.isBarsScroll = true;
    if (number > 2365) this.isFranchiseScroll = true;
  }

  resetScrolls(): void {
    this.isCreateScroll = false;
    this.isAboutScroll = false;
    this.isBarsScroll = false;
    this.isServicesScroll = false;
    this.isFranchiseScroll = false;
  }

}