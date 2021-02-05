import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment.prod';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { AdminComponent } from './admin/admin.component';
import { AdminServicesComponent } from './admin/admin-services/admin-services.component';
import { AdminGbarsComponent } from './admin/admin-gbars/admin-gbars.component';
import { AdminCitiesComponent } from './admin/admin-cities/admin-cities.component';
import { AdminMenuComponent } from './admin/admin-menu/admin-menu.component';
import { AdminVacanciesComponent } from './admin/admin-vacancies/admin-vacancies.component';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserDataComponent } from './pages/profile/user-data/user-data.component';
import { UserOrdersComponent } from './pages/profile/user-orders/user-orders.component';
import { UserOrdersHistoryComponent } from './pages/profile/user-orders-history/user-orders-history.component';


import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from "ngx-ui-loader";
import { ngxUiLoaderConfig } from "./shared/exports/preloader-config";

import { SearchPipe } from './shared/pipes/search.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    VacanciesComponent,
    AdminComponent,
    AdminServicesComponent,
    SearchPipe,
    AdminGbarsComponent,
    AdminCitiesComponent,
    AdminMenuComponent,
    AdminVacanciesComponent,
    ProfileComponent,
    AuthComponent,
    UserDataComponent,
    UserOrdersComponent,
    UserOrdersHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ColorPickerModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    NgSelectModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
