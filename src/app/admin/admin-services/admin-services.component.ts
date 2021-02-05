import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Service } from 'src/app/shared/classes/service.model';
import { IService } from 'src/app/shared/interfaces/service.interface';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { TemplateRef } from '@angular/core';
import { ServicesService } from 'src/app/shared/services/services.service';

@Component({
  selector: 'app-admin-services',
  templateUrl: './admin-services.component.html',
  styleUrls: ['./admin-services.component.scss']
})
export class AdminServicesComponent implements OnInit {
  services: Array<IService>;
  service: IService;
  serviceID: string;
  serviceName: string;
  serviceIcon: string;
  serviceFirstImg: string;
  serviceSecondImg: string;
  serviceBtnColor: string;
  isEdited = false;
  isChecked = false;
  searchName: string;
  modalSM = 'modal-sm modal-dialog-centered';
  modalLG = 'modal-lg modal-dialog-centered';
  modalCenter = 'modal-dialog-centered'
  checkModel: any = { left: false, middle: true, right: false };
  modalRef: BsModalRef;
  constructor(private storage: AngularFireStorage,
                      private servicesService: ServicesService,
                      private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getServices();
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
    });
  }

  checkService(): void{
    if (this.serviceName == '' || this.serviceIcon == '' || this.serviceFirstImg == '' || this.serviceSecondImg == '' || this.serviceBtnColor == '') this.isChecked = true;
  }

  addService(): void {
    this.checkService();
    if (!this.isChecked) {
      const newService = new Service('oo', this.serviceName, this.serviceIcon, this.serviceFirstImg, this.serviceSecondImg, this.serviceBtnColor);
      delete newService.id;
      this.servicesService.create(newService).then(() => {
        this.modalRef.hide();
        this.resetForm();
      });
    }
    this.isChecked = false;
  }

  deleteService(service: IService): void {
    this.serviceID = service.id;
  }

  deleteSubmit(status: boolean): void {
    if (status) {
      this.servicesService.delete(this.serviceID).then(() => {
        this.getServices();
      });
    }
    this.modalRef.hide();
    this.serviceID = null;
  }

  editService(service: IService): void {
    this.serviceID = service.id;
    this.serviceName = service.name;
    this.serviceIcon = service.icon;
    this.serviceFirstImg = service.contentFirstImg,
    this.serviceSecondImg = service.contentSecondImg,
    this.serviceBtnColor = service.btnColor;
    this.isEdited = true;
  }
  
  updateService(): void {
    this.checkService();
    if (!this.isChecked) {
      const updService = new Service(this.serviceID, this.serviceName, this.serviceIcon, this.serviceFirstImg, this.serviceSecondImg, this.serviceBtnColor);
      this.servicesService.update(updService.id, updService)
      .catch(err => console.log(err));
      this.getServices();
      this.modalRef.hide();
      this.resetForm();
      this.isEdited = false;
    }
    this.isChecked = false;
  }

  uploadFile(event, status1: boolean, status2: boolean): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const upload = this.storage.upload(filePath, file);
    upload.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        if (status1 && status2) this.serviceIcon = url;
        else if (!status1 && status2) this.serviceFirstImg = url;
        else  if (status1 && !status2) this.serviceSecondImg = url;
      });
    });
  }
  
  openModal(template: TemplateRef<any>, modalStyle): void {
    const config: ModalOptions = { class: `${modalStyle}`};
    this.modalRef = this.modalService.show(template, config);
  }

  resetForm(): void {
    this.serviceName = '';
    this.serviceIcon = '';
    this.serviceFirstImg = '';
    this.serviceSecondImg = '';
    this.serviceBtnColor = '';
    if (this.isEdited) this.isEdited = !this.isEdited;
  }

}