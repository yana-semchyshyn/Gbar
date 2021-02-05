import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCitiesComponent } from './admin/admin-cities/admin-cities.component';
import { AdminGbarsComponent } from './admin/admin-gbars/admin-gbars.component';
import { AdminMenuComponent } from './admin/admin-menu/admin-menu.component';
import { AdminServicesComponent } from './admin/admin-services/admin-services.component';
import { AdminVacanciesComponent } from './admin/admin-vacancies/admin-vacancies.component';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './pages/main/main.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserDataComponent } from './pages/profile/user-data/user-data.component';
import { UserOrdersHistoryComponent } from './pages/profile/user-orders-history/user-orders-history.component';
import { UserOrdersComponent } from './pages/profile/user-orders/user-orders.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { ProfileGuard } from './shared/guards/profile.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: 'main', component: MainComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'admin-login', component: AuthComponent  },
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'user-data' },
    { path: 'user-data', component: UserDataComponent },
    { path: 'user-orders', component: UserOrdersComponent },
    { path: 'user-orders-history', component: UserOrdersHistoryComponent },
  ] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'cities' },
    { path: 'cities', component: AdminCitiesComponent },
    { path: 'services', component: AdminServicesComponent },
    { path: 'gbars', component: AdminGbarsComponent },
    { path: 'menu', component: AdminMenuComponent },
    { path: 'vacancies', component: AdminVacanciesComponent },
  ] },
  { path: '**', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
