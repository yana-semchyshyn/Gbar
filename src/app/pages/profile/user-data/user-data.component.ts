import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CityService } from 'src/app/shared/services/city.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {
  CURRENT_USER: any = null;
  cities: Array<ICity>;
  city: ICity;
  cityName: string;
  email: string;
  firstLastName: string;
  dateOfBirthday: Date;
  isDataUpdate: boolean = false;
  isUserBirthday: boolean = false;
  cityRegExp = /^[а-яґєіїА-ЯҐЄІЇa-zA-Z]{1,}$/;
  nameRegExp = /^[а-яґєіїА-ЯҐЄІЇa-zA-Z]{1,}\s[а-яґєіїА-ЯҐЄІЇa-zA-Z]{2,}$/;
  emailRegExp = /^[a-zA-z\d\.-]+@[a-z]+\.[a-z]{2,6}$/;
  constructor(private authService: AuthService, private cityService: CityService, public location: Location) { }

  ngOnInit(): void {
    this.getCities();
    this.getLocalUser();
  }

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

  setCity(): void {
    this.city = this.cities.filter(city => city.name === this.cityName)[0];
  }

  signOut(): void {
    this.authService.signOut();
    this.resetUserData();
  }

  updateUserData(): void {
    if (this.dataValidation()){
      this.CURRENT_USER = JSON.parse(localStorage.getItem('user'));
      const data = {
        city: this.cityName,
        firstLastName: this.firstLastName,
        birthday: this.dateOfBirthday,
        email: this.email,
      }
      this.authService.updateUserData(this.CURRENT_USER.id, data).then(() => {
        this.updateLocal(data);
        this.isDataUpdate = true;
      });
    }
  }

  updateLocal(data): void {
    const local = {
      ...this.CURRENT_USER,
      ...data
    }
    localStorage.setItem('user', JSON.stringify(local))
  }

  getLocalUser(): void {
    if (localStorage.getItem('user') != null) {
      this.CURRENT_USER = JSON.parse(localStorage.getItem('user'));
      this.cityName = this.CURRENT_USER.city;
      this.firstLastName = this.CURRENT_USER.firstLastName;
      this.dateOfBirthday = this.CURRENT_USER.birthday;
      this.email = this.CURRENT_USER.email;
      document.querySelectorAll('option').forEach(element => {
        if (element.value == this.cityName) element.selected = true;
      });

      this.isUserBirthday = this.authService.checkUserBirthday(this.CURRENT_USER);
    }
  }

  dataValidation(): boolean {
    if (this.cityRegExp.test(this.cityName) && this.nameRegExp.test(this.firstLastName)
    && ((new Date().getFullYear() - new Date(this.dateOfBirthday).getFullYear()) >= 16) && this.emailRegExp.test(this.email)) return true;
    else return false;
  }

  closeErrorBox(): void {
    this.isDataUpdate = false;
    this.isUserBirthday = false;
  }

  resetUserData(): void {
    this.CURRENT_USER = null;
    this.cityName = '';
    this.firstLastName = '';
    this.dateOfBirthday = null;
    this.email = '';
    this.isDataUpdate = false;
  }

}

