import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { Vacancy } from 'src/app/shared/classes/vacancies.modal';
import { ICity } from 'src/app/shared/interfaces/city.interface';
import { IVacancy } from 'src/app/shared/interfaces/vacancies.interface';
import { CityService } from 'src/app/shared/services/city.service';
import { VacanciesService } from 'src/app/shared/services/vacancies.service';

@Component({
  selector: 'app-admin-vacancies',
  templateUrl: './admin-vacancies.component.html',
  styleUrls: ['./admin-vacancies.component.scss']
})
export class AdminVacanciesComponent implements OnInit {
  cities: Array<ICity>;
  vacancies: Array<IVacancy>;
  vacancy: IVacancy;
  vacancyID: string;
  vacancyCity: ICity;
  vacancyCityName: string;
  vacancyName: string;
  vacancyFirstImg: string;
  vacancySecondImg: string;
  vacancyDescription: string;
  isEdited = false;
  isChecked = false;
  searchName: string;
  modalSM = 'modal-sm modal-dialog-centered';
  modalLG = 'modal-lg modal-dialog-centered';
  modalCenter = 'modal-dialog-centered'
  checkModel: any = { left: false, middle: true, right: false };
  modalRef: BsModalRef;
  constructor(private storage: AngularFireStorage,
                      private vacanciesService: VacanciesService,
                      private citiesService: CityService,
                      private modalService: BsModalService) { }

  ngOnInit(): void {
    this. getCities();
    this.getVacancies();
  }

  private getVacancies(): void {
    this.vacanciesService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.vacancies = data;
    });
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
    });
  }

  setCity(): void {
    this.vacancyCity = this.cities.filter(city => city.name === this.vacancyCityName)[0];
  }

  checkVacancy(): void{
    if (this.vacancyCityName == '' || this.vacancyName == '' || this.vacancyFirstImg == '' || this.vacancySecondImg == '' || this.vacancyDescription == '') this.isChecked = true;
  }

  addVacancy(): void {
    this.checkVacancy();
    if (!this.isChecked) {
      const newVacancy = new Vacancy('oo', this.vacancyCity, this.vacancyName, this.vacancyFirstImg, this.vacancySecondImg, this.vacancyDescription);
      console.log(newVacancy);
      delete newVacancy.id;
      this.vacanciesService.create(newVacancy).then(() => {
        this.modalRef.hide();
        this.resetForm();
      });
    }
    this.isChecked = false;
  }

  deleteVacancy(vacancy: IVacancy): void {
    this.vacancyID = vacancy.id;
  }

  deleteSubmit(status: boolean): void {
    if (status) {
      this.vacanciesService.delete(this.vacancyID).then(() => {
        this.getVacancies();
      });
    }
    this.modalRef.hide();
    this.vacancyID = null;
  }

  editVacancy(vacancy: IVacancy): void {
    this.vacancyID = vacancy.id;
    this.vacancyCity = vacancy.city;
    this.vacancyCityName = vacancy.city.name;
    this.vacancyName = vacancy.name;
    this.vacancyFirstImg = vacancy.contentFirstImg;
    this.vacancySecondImg = vacancy.contentSecondImg,
    this.vacancyDescription = vacancy.description,
    this.isEdited = true;
  }
  
  updateVacancy(): void {
    this.checkVacancy();
    if (!this.isChecked) {
      const updVacancy = new Vacancy(this.vacancyID, this.vacancyCity, this.vacancyName, this.vacancyFirstImg, this.vacancySecondImg, this.vacancyDescription);
      this.vacanciesService.update(updVacancy.id, updVacancy)
      .catch(err => console.log(err));
      this.getVacancies();
      this.modalRef.hide();
      this.resetForm();
      this.isEdited = false;
    }
    this.isChecked = false;
  }

  uploadFile(event, status: boolean): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    upload.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        if (status) this.vacancyFirstImg = url;
        else this.vacancySecondImg = url;
      });
    });
  }
  
  openModal(template: TemplateRef<any>, modalStyle): void {
    const config: ModalOptions = { class: `${modalStyle}`};
    this.modalRef = this.modalService.show(template, config);
  }

  resetForm(): void {
    this.vacancyCity = undefined;
    this.vacancyCityName = '';
    this.vacancyName = '';
    this.vacancyFirstImg = '';
    this.vacancySecondImg = '';
    this.vacancyDescription = '';
    if (this.isEdited) this.isEdited = !this.isEdited;
  }

}
