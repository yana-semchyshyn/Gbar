import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.checkAdminLogin()){
      return true;
    }
    else{
      this.router.navigateByUrl('admin-login');
    }
  }

  checkAdminLogin(): boolean{
    if (localStorage.getItem('adminCredential')) {
      const admin = JSON.parse(localStorage.getItem('adminCredential'));
      if (admin && admin.email === 'admin@gmail.com') {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  
}
