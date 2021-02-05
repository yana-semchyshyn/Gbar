import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';
import { Menu } from 'src/app/shared/classes/menu.modal';
import { IMenu } from 'src/app/shared/interfaces/menu.interface';
import { MenuService } from 'src/app/shared/services/menu.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
  menu: Array<IMenu>;
  menuItem: IMenu;
  menuItemID: string;
  menuItemName: string;
  menuItemTime: string;
  isEdited = false;
  isChecked = false;
  modalSM = 'modal-sm modal-dialog-centered';
  modalCentered = 'modal-dialog-centered'; 
  modalRef: BsModalRef;
  searchName: string;
  checkModel: any = { left: false, middle: true, right: false };
  constructor(private menuService: MenuService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getMenu();
  }

  openModal(template: TemplateRef<any>, modalWidth): void {
    const config: ModalOptions = { class: `${modalWidth}` };
    this.modalRef = this.modalService.show(template, config);
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

  public addMenuItem(): void {
    this.checkMenuItem();
    if (!this.isChecked) {
      const newMenuItem = new Menu('oo', this.menuItemName, this.menuItemTime);
      delete newMenuItem.id;
      this.menuService.create(newMenuItem).then(() => {
        this.modalRef.hide();
        this.resetForm();
      });
    }
  }

  public editMenuItem(menuItem: IMenu): void {
    this.menuItemID = menuItem.id;
    this.menuItemName = menuItem.name;
    this.menuItemTime = menuItem.time;
    this.isEdited = true;
  }

  public updateMenuItem(): void {
    this.checkMenuItem(); 
    if (!this.isChecked) {
      const newMenuItem = new Menu(this.menuItemID, this.menuItemName, this.menuItemTime, 0);
      this.menuService.update(newMenuItem.id, newMenuItem).then(() => {
        this.modalRef.hide();
        this.resetForm();
        this.getMenu();
      });
    }
  }

  public deleteMenuItem(menuItem: IMenu): void {
    this.menuItemID = menuItem.id;
  }

  public deleteSubmit(status: boolean): void {
    if (status) {
      this.menuService.delete(this.menuItemID).then(() => {
        this.getMenu();
      });
    }
    this.modalRef.hide();
    this.menuItemID = null;
  }

  checkMenuItem(): void {
    if (this.menuItemName == '') this.isChecked = true;
  }

  resetForm(): void {
    this.menuItemName = '';
    this.menuItemTime = '';
    if (this.isEdited) this.isEdited = !this.isEdited;
  }

}