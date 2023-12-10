import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth.service';
import { LoginService } from './login.service';

@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent{
    private tokenValidationInterval: any;
    private readonly TOKEN_VALIDATION_FLAG = 'tokenValidationActive';
    loginText: string = 'Login';
    loginLink: string = '/login';

    constructor(private dataService: DataService,
                private router: Router,
                private authService: AuthService,
                private loginService: LoginService) {}

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

        this.dataService.login(data).subscribe(
          (response: any) => {
            // console.log(response);
            if(response.success === false){
              alert(response.err);
            }else{
              const token = this.decodeToken(response.token);
              // console.log(token);
              const message = `Good to see you, ${response.firstname}!`;
              localStorage.setItem('userId', data.userId);
              this.tokenSet();
              alert(message);
              this.loginService.isLoggedIn = true;
              this.router.navigate(['/']);
            }

          },
          (error) => {
            // console.error('Login failed!', error);
            alert(error.error.err);
          }
        );
      }
    }

    decodeToken(token: any) {
      try {
        const decodedToken:any = jwtDecode(token);
        localStorage.setItem('jwt', token);
        localStorage.setItem('exp', decodedToken.exp);
        // console.log('Decoded token:', decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    tokenSet() {
        const userId = localStorage.getItem('userId');
        if(userId != null){
          if (!this.tokenValidationInterval) {
            this.initTokenValidation();
          }
        }else{
          if (this.tokenValidationInterval) {
            clearInterval(this.tokenValidationInterval);
            this.tokenValidationInterval = null;
          }
        }
    }

    initTokenValidation() {
      if (!this.tokenValidationInterval) {
        this.tokenValidationInterval = setInterval(() => {
          const isValid = this.authService.isTokenValid();
          if (!isValid) {
            clearInterval(this.tokenValidationInterval);
            this.tokenValidationInterval = null;
          }
        }, 1000);
      }
    }
}
