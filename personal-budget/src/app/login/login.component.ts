import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {

    constructor(private loginService: DataService, private router: Router, private menuService: MenuService) {}

    dataValidation() {
      const userIdElement = document.getElementById('userId') as HTMLInputElement;
      const passwordElement = document.getElementById('password') as HTMLInputElement;

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

      return true;
    }

    login() {
      if(this.dataValidation()){
        const userIdElement = document.getElementById('userId') as HTMLInputElement;
        const passwordElement = document.getElementById('password') as HTMLInputElement;

        const data = {
          userId: userIdElement.value,
          password: passwordElement.value,
        };

        this.loginService.login(data).subscribe(
          (response: any) => {
            console.log(response);
            if(response.success == false){
              alert(response.err);
            }else{
              const token = this.decodeToken(response.token);
              console.log(token);
              // setInterval(isTokenValid, 180000); // 1000 milliseconds = 1 second
              const message = `Good to see you, ${response.firstname}!`;
              alert(message);
              // this.menuService.setLoginText('Logout');
              // this.menuService.setLoginLink('/');
              // this.router.navigate(['/']);
              window.location.href = '/';
            }

          },
          (error) => {
            console.error('Login failed!', error);
          }
        );
      }
    }

    decodeToken(token: any) {
      try {
        const decodedToken:any = jwtDecode(token);
        localStorage.setItem('jwt', token);
        localStorage.setItem('exp', decodedToken.exp);
        console.log('Decoded token:', decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

}
