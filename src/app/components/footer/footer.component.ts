import { Component, OnInit } from '@angular/core';
import { GbarsService } from 'src/app/shared/services/gbars.service';
import { IGbar } from 'src/app/shared/interfaces/gbars.interface';
import { ServicesService } from 'src/app/shared/services/services.service';
import Telegram from 'telegram-send-message';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentGbar: IGbar;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  isWriteMessage: boolean = false;
  nameRegExp = /^[а-яґєіїА-ЯҐЄІЇa-zA-Z\s]{1,}$/;
  textRegExp = /^[а-яґєіїА-ЯҐЄІЇ\w\s]{1,}$/;
  emailRegExp = /^[a-zA-z\d\.-]+@[a-z]+\.[a-z]{2,6}$/;
  phoneRegExp = /^\+?3?8?(0[5-9][0-9]\d{7})$/;
  constructor(private gbarsService: GbarsService, private servicesService: ServicesService) { }

  ngOnInit(): void {
    this.getLocal();
  }

  getLocal(): void {
    this.gbarsService.localGbar.subscribe(() => {
      this.currentGbar = JSON.parse(localStorage.getItem('gbar'));
    })
  }

  sendDataToTelegram(): void {
    if (this.nameRegExp.test(this.name) && this.emailRegExp.test(this.email) && this.phoneRegExp.test(this.phoneNumber) && this.textRegExp.test(this.message)) {
      Telegram.setToken('1480206103:AAHbY-CLU1uaLPPoSr8b_2MWZtC-8I0vdmU');
      Telegram.setRecipient('-466307024');
      Telegram.setMessage(`${this.name}👋%0A📬 ${this.email}%0A📞 ${this.phoneNumber}%0A%0A${this.message}`);
      Telegram.send();
      this.closeModal();
      this.resetMessage();
    }
  }

  openService(i: number): void {
    this.servicesService.goTo(i);
  }

  openModal(): void {
    this.isWriteMessage = true;
    document.querySelector('body').style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isWriteMessage = false;
    document.querySelector('body').style.overflow = 'visible';
  }

  resetMessage(): void {
    this.name = '';
    this.email = '';
    this.phoneNumber = '';
    this.message = '';
  }

}