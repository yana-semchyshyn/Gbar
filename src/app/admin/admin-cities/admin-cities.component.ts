import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { CityService } from 'src/app/shared/services/city.service';
import { City } from 'src/app/shared/classes/city.modal';
import { ICity } from 'src/app/shared/interfaces/city.interface';

@Component({
  selector: 'app-admin-cities',
  templateUrl: './admin-cities.component.html',
  styleUrls: ['./admin-cities.component.scss']
})
export class AdminCitiesComponent implements OnInit {
  cities: Array<ICity>;
  city: ICity;
  cityID: string;
  cityName: string;
  cityDate = new Date();
  isEdited = false;
  isChecked = false;
  modalSM = 'modal-sm modal-dialog-centered';
  modalCentered = 'modal-dialog-centered'; 
  modalRef: BsModalRef;
  searchName: string;
  checkModel: any = { left: false, middle: true, right: false };
  constructor(private cityService: CityService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getCities();
  }

  openModal(template: TemplateRef<any>, modalWidth): void {
    const config: ModalOptions = { class: `${modalWidth}` };
    this.modalRef = this.modalService.show(template, config);
  }

  private getCities(): void {
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

  public addCity(): void {
    this.checkCity();
    if (!this.isChecked) {
      const newCity = new City('oo', this.cityName, this.cityDate);
      delete newCity.id;
      this.cityService.create(newCity).then(() => {
        this.modalRef.hide();
        this.resetForm();
      });
    }
  }

  public editCity(city: ICity): void {
    this.cityID = city.id;
    this.cityName = city.name;
    this.isEdited = true;
  }

  public updateCity(): void {
    this.checkCity(); 
    if (!this.isChecked) {
      const newCity = new City(this.cityID, this.cityName, this.cityDate);
      this.cityService.update(newCity.id, newCity).then(() => {
        this.modalRef.hide();
        this.getCities();
        this.resetForm();
      });
    }
  }

  public deleteCity(city: ICity): void {
    this.cityID = city.id;
  }

  public deleteSubmit(status: boolean): void {
    if (status) {
      this.cityService.delete(this.cityID).then(() => {
        this.getCities();
      });
    }
    this.modalRef.hide();
    this.cityID = null;
  }

  checkCity(): void {
    if (this.cityName == '') this.isChecked = true;
    else {
      this.cities.forEach(element => {
        if (element.name == this.cityName) {
          return this.isChecked = true;
        }
      });
    }
  }

  resetForm(): void {
    this.cityName = '';
    if (this.isEdited) this.isEdited = !this.isEdited;
  }

}