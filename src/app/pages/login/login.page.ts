import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/resources/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: any;
  public password: any;

  constructor(
    public router: Router,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  }

  login() {
    this.firebaseService.loginWithEmail({ email: this.email, password: this.password }).then((userCredential: any) => {
      console.log(userCredential);
      if (userCredential.user.uid) {
        this.firebaseService.getDetails({ uid: userCredential.user.uid }).subscribe((user: any) => {
          console.log(user);
          alert('Welcome ' + user.name);
        }, err => {
          console.log(err);
        });
      }
    }, err => {
      alert(err.message);
      console.log(err);
    });
  }


  signup() {
    this.router.navigateByUrl('signup');
  }

}
