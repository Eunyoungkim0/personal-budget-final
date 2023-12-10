import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'pb-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  private tokenValidationInterval: any;
  loginText: string = 'Login';
  loginLink: string = '/login';
  constructor(private router: Router, public loginService: LoginService, private authService: AuthService,) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if(userId != null){
      this.loginService.isLoggedIn = true;
      window.onbeforeunload = () => {
        localStorage.setItem('reloading', 'true');
      };
    }

    const reload = localStorage.getItem('reloading');

    if(userId != null && reload == 'true'){
      // alert("token check needed.");
      localStorage.removeItem('reloading');
      this.tokenSet();
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('exp');
      localStorage.removeItem('userId');
      this.loginService.isLoggedIn = false;
      alert("Thank you for using personal budget app!\nHave a wonderful day!");
      this.router.navigate(['/']);
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
