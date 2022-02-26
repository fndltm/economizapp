import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/resources/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide = true;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(
    public router: Router,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  }

  login() {
    this.firebaseService.loginWithEmail({
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }).then((userCredential: any) => {
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
