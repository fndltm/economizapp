import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/resources/services/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public email: any;
  public password: any;
  public name: any;

  constructor(
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  }

  signup() {
    this.firebaseService.signup({ email: this.email, password: this.password }).then(res => {
      if (res.user.uid) {
        const data = {
          email: this.email,
          password: this.password,
          name: this.name,
          uid: res.user.uid
        };
        this.firebaseService.saveDetails(data).then(() => {
          alert('Account Created!');
        }, err => {
          console.log(err);
        });
      }
    }, err => {
      alert(err.message);

      console.log(err);
    });
  }

}
