import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  email: string;
  password: string;
  isPassword: boolean = false;
  constructor(private auth: AuthService,  public location: Location) { }

  ngOnInit(): void {
  }

  adminSignIn(): void {
    this.auth.signInAdmin(this.email, this.password)
  }

  showPassword(): void {
    this.isPassword = !this.isPassword;
  }

  resetForm(): void{
    this.email = '';
    this.password = '';
  }

}
