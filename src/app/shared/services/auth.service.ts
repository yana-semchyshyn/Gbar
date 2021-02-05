import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Profile } from '../classes/profile.modal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userOrders: boolean = false;
  notValidSignUpData: Subject<boolean> = new Subject<boolean>();
  notValidSignInData: Subject<boolean> = new Subject<boolean>();
  checkSignIn: Subject<boolean> = new Subject<boolean>();
  checkAdminSignIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  userRef: AngularFirestoreCollection<any> = null;
  private dbPath = '/users';

  constructor(private db: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router) {
    this.userRef = this.db.collection(this.dbPath);
  }

  signUp(phoneNumber: string, city: string, firstLastName: string, birthday: Date, email: string, password): void {
    this.auth.createUserWithEmailAndPassword(email, password)
      .then(userResponse => {
        const user = new Profile(phoneNumber, city, firstLastName, birthday, userResponse.user.email);
        this.db.collection('users').add({ ...user });
        this.db.collection('users').ref.where('email', '==', userResponse.user.email).onSnapshot(
          snap => {
            snap.forEach(user => {
              const myUser = {
                id: user.id,
                ...user.data() as any
              }
              localStorage.setItem('user', JSON.stringify(myUser));
              this.checkSignIn.next(true);
              this.router.navigateByUrl('profile/user-data');
            })
          }
        )
      })
      .catch(err =>{
        console.log(err)
        this.notValidSignUpData.next(true);
      });
  }

  signIn(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(userResponse => {
        this.db.collection('users').ref.where('email', '==', userResponse.user.email).onSnapshot(
          snap => {
            snap.forEach(user => {
              const myUser = {
                id: user.id,
                ...user.data() as any
              };
              localStorage.setItem('user', JSON.stringify(myUser));
              this.checkSignIn.next(true);
              this.router.navigateByUrl('profile/user-data');
            });
          }
        );
      })
      .catch(err => {
        console.log(err);
        this.notValidSignInData.next(true);
      });
  }

  signOut(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.checkSignIn.next(false);
        this.router.navigateByUrl('main');
      });
  }

  signInAdmin(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password).then(response => {
      const data = {
        id: response.user.uid,
        email: response.user.email
      };
      localStorage.setItem('adminCredential', JSON.stringify((data)));
      response.user.getIdToken().then(
        token => {
          localStorage.setItem('token', token);
          this.router.navigateByUrl('admin');
          this.checkAdminSignIn.next(true);
        }
      );
    });
  }

  signOutAdmin(): void {
    this.auth.signOut()
      .then(() => {
        localStorage.removeItem('adminCredential');
        localStorage.removeItem('token');
        this.checkAdminSignIn.next(false);
        this.router.navigateByUrl('main');
      });
  }

  updateUserData(id: string, data: any): Promise<void> {
    return this.userRef.doc(id).update({ ...data });
  }

  checkUserBirthday(userCredentials: any): boolean{
    if (new Date(userCredentials.birthday).toLocaleDateString().slice(0, 5) == new Date().toLocaleDateString().slice(0, 5)) return true;
  }

  goToUserOrders(): void{
    this.router.navigateByUrl('profile/user-orders');
    this.userOrders = true;
  }

  resetUserOrders(): void{
    this.userOrders = false;
  }

  checkToken(): Observable<string> {
    return this.auth.idToken;
  }
}