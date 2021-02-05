import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { map } from 'rxjs/operators';
import { IGbar } from 'src/app/shared/interfaces/gbars.interface';
import { IVacancy } from 'src/app/shared/interfaces/vacancies.interface';
import { VacanciesService } from 'src/app/shared/services/vacancies.service';
import Telegram from 'telegram-send-message';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {
  vacancies: Array<IVacancy>;
  currentVacancies: Array<IVacancy>;
  vacancyName = 'Обирай вакансію мрії';
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  instagram: string;
  FormData: FormData;
  aboutYou: string;
  currentGbar: IGbar;
  currentCity: string;
  sendResume = false;
  isFirst: boolean;
  isLast: boolean;
  isDetails: boolean;
  isVacancies: boolean;
  isCreateScroll: boolean;
  isAdvantageScroll: boolean;
  isVacanciesScroll: boolean;
  nameRegExp = /^[а-яґєіїА-ЯҐЄІЇa-zA-Z\s]{1,}$/;
  phoneRegExp = /^\+?3?8?(0[5-9][0-9]\d{7})$/;
  emailRegExp = /^[a-zA-z\d\.-]+@[a-z]+\.[a-z]{2,6}$/;
  textRegExp = /^[а-яґєіїА-ЯҐЄІЇ\w\s]{1,}$/;

  slideConfigVacancies = {
    "slidesToShow": 1, "slidesToScroll": 1,
    'nextArrow': '.next',
    'prevArrow': '.prev',
    "infinite": false,
    "variableWidth": true,
    'arrows': false,
    "dots": false,
    "speed": 0,
  };

  constructor(private vacanciesService: VacanciesService) {
  }

  ngOnInit(): void {
    this.getVacancies();
  }

  @ViewChild('slickVacancyModal') slickVacancyModal: SlickCarouselComponent;

  private getVacancies(): void {
    this.vacanciesService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.vacancies = data;
      this.getLocal();
    });
  }

  getCurrentVacancies(city: string): void {
    this.currentVacancies = this.vacancies.filter(function (vacancy) {
      return vacancy.city.name == city;
    });
    if (this.currentVacancies.length !== 0) this.isVacancies = true;
    else this.isVacancies = false;
  }

  getLocal(): void {
    if (localStorage.getItem('gbar') != null) {
      this.currentGbar = JSON.parse(localStorage.getItem('gbar'));
      this.currentCity = this.currentGbar.city.name;
      this.getCurrentVacancies(this.currentGbar.city.name);
    }
  }

  sendDataToTelegram(): void {
    if (this.nameRegExp.test(this.vacancyName) && this.nameRegExp.test(this.firstName) && this.nameRegExp.test(this.lastName) && this.nameRegExp.test(this.city)
      && this.phoneRegExp.test(this.phoneNumber) && this.emailRegExp.test(this.email) && this.textRegExp.test(this.instagram) && this.aboutYou != undefined && this.FormData != undefined) {
      Telegram.setToken('1480206103:AAHbY-CLU1uaLPPoSr8b_2MWZtC-8I0vdmU');
      Telegram.setRecipient('-470323612');
      Telegram.setMessage(`🎀 ${this.vacancyName.toUpperCase()}%0A${this.firstName} ${this.lastName} 👋%0A${this.city}%0A📞 ${this.phoneNumber}%0A📬 ${this.email}%0AInstagram: https://www.instagram.com/${this.instagram}/ %0A%0AПро себе:%0A${this.aboutYou}`);
      Telegram.send();
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.telegram.org/bot1480206103:AAHbY-CLU1uaLPPoSr8b_2MWZtC-8I0vdmU/sendDocument?chat_id=-470323612');
      xhr.send(this.FormData);
      this.closeModal(true);
    }
  }

  uploadFile(event): void {
    const file = event.target.files[0];
    this.FormData = new FormData();
    this.FormData.append("document", file);
  }

  goTo(i: number): void {
    this.slickVacancyModal.slickGoTo(i);
  }

  next(): void {
    this.slickVacancyModal.slickNext();
  }

  prev(): void {
    this.slickVacancyModal.slickPrev();
  }

  afterChange(e): void {
    if (e.currentSlide == 0) this.isFirst = true;
    else this.isFirst = false;
    if (e.currentSlide === e.slick.slideCount - 1) this.isLast = true;
    else this.isLast = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let scroll = window.scrollY;
    this.checkScrolls(scroll);
  }

  checkScrolls(scroll: number): void {
    if (scroll > 3) this.isCreateScroll = true;
    if (scroll > 6) this, this.isVacanciesScroll = true;
    if (scroll > 10) this.isAdvantageScroll = true;
  }

  openModal(status: boolean, i?: number): void {
    if (status) {
      this.hideScroll();
      this.sendResume = true;
    }
    else {
      this.isDetails = true;
      setTimeout(() => {
        this.slickVacancyModal.slickGoTo(i);
        this.vacancyName = this.currentVacancies[i].name;
        this.hideScroll();
      }, 2);
    }
  }

  closeModal(status: boolean): void {
    if (status) {
      this.sendResume = false;
      this.resetForm();
      if (!this.isDetails) this.showScroll();
    }
    else {
      this.isDetails = false;
      this.showScroll();
    }
  }

  hideScroll(): void {
    document.querySelector('body').style.overflow = 'hidden';
  }

  showScroll(): void {
    document.querySelector('body').style.overflow = 'visible';
  }

  resetForm(): void {
    this.vacancyName = 'Обирай вакансію мрії';
    this.firstName = '';
    this.lastName = '';
    this.city = '';
    this.phoneNumber = '';
    this.email = '';
    this.instagram = '';
    this.aboutYou = '';
    this.FormData = null;
  }

}