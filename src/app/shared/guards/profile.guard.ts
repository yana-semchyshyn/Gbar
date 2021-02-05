import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin();
  }

  private checkLogin(): boolean {
    if (localStorage.getItem('user')){
      const CURRENT_USER = JSON.parse(localStorage.getItem('user'));
      if (CURRENT_USER.role === 'user' && CURRENT_USER != null){
        return true;
      }
    }
    this.router.navigateByUrl('main');
  }
}
