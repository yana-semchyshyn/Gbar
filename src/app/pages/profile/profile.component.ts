import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(public location: Location) { }

  ngOnInit(): void {
    this.showScroll();
  }

  showScroll(): void{
    setTimeout(() => {
      if (document.body.style.overflow == 'hidden') document.body.style.overflow = 'visible';
    }, 1000);
  }
}
