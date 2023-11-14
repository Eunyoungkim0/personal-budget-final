import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  constructor(private signupService: DataService) {}

  dataValidation() {
    const userIdElement = document.getElementById('userId') as HTMLInputElement;
    const passwordElement = document.getElementById('password') as HTMLInputElement;
    const firstnameElement = document.getElementById('firstname') as HTMLInputElement;
    const lastnameElement = document.getElementById('lastname') as HTMLInputElement;

    if(userIdElement.value == ""){
      alert("Please enter user ID.");
      userIdElement.focus();
      return false;
    }
    if(passwordElement.value == ""){
      alert("Please enter password.");
      passwordElement.focus();
      return false;
    }
    if(firstnameElement.value == ""){
      alert("Please enter your first name.");
      firstnameElement.focus();
      return false;
    }
    if(lastnameElement.value == ""){
      alert("Please enter last name.");
      lastnameElement.focus();
      return false;
    }

    return true;
  }

  signup() {
    if(this.dataValidation()){
      const userIdElement = document.getElementById('userId') as HTMLInputElement;
      const passwordElement = document.getElementById('password') as HTMLInputElement;
      const firstnameElement = document.getElementById('firstname') as HTMLInputElement;
      const lastnameElement = document.getElementById('lastname') as HTMLInputElement;

      const data = {
        userId: userIdElement.value,
        password: passwordElement.value,
        firstname: firstnameElement.value,
        lastname: lastnameElement.value,
      };
      console.log(data);


      this.signupService.signup(data).subscribe(
        (response) => {
          console.log('Signup successful!', response);
        },
        (error) => {
          console.error('Signup failed!', error);
        }
      );
    }
  }
}