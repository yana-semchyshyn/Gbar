import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GBar';
  currentURL: string;
  isHeader: boolean = true;
  isFooter: boolean = true;
  isAdmin: boolean = false;
  constructor(private router: Router, private auth: AuthService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentURL = this.router.url;
        if (this.currentURL == '/privacy-policy') {
          this.isHeader = false;
          this.isFooter = false;
        }
        else if (this.currentURL.split('/')[1] == 'admin') {
          this.isHeader = false;
          this.isFooter = false;
        }
        else if (this.currentURL.split('/')[1] == 'profile') {
          this.isHeader = false;
          this.isFooter = false;
        }
        else {
          this.isHeader = true;
          this.isFooter = true;
        }
      }
    });
  }

  ngOnInit() {
    this.checkLocalAdmin();
  }

  checkLocalAdmin(): void {
    this.auth.checkAdminSignIn.subscribe(() => {
      if (localStorage.getItem('adminCredential')) this.isAdmin = true;
      else this.isAdmin = false;
    })
  }

}