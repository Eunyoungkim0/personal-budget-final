import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router, private loginService: LoginService) { }

  isTokenValid(): boolean {
    const token:any = localStorage.getItem('jwt');
    const exp:any = localStorage.getItem('exp');

    if (!token) {
        // console.log("No token");
        return false;
    }
    try {
        // console.log("date now : " + Date.now());
        // console.log("expire   : " + exp * 1000);
        // console.log("Time left: " + (exp * 1000 - Date.now())/1000 + "s");

        if (Date.now() >= exp * 1000) {
            // alert("Token is expired");
            localStorage.removeItem('jwt');
            localStorage.removeItem('exp');
            localStorage.removeItem('userId');
            localStorage.removeItem('tokenValidationActive');
            localStorage.removeItem('extendMsgShow');
            localStorage.removeItem('reloading');
            this.loginService.isLoggedIn = false;
            // alert("Thank you for using personal budget app!\nHave a wonderful day!");
            this.router.navigate(['/']);
            return false;
        } else {
          const timeLeft = Math.floor((exp * 1000 - Date.now()) / 1000);
          if(timeLeft <= 20){
            const extendMsgShow = localStorage.getItem('extendMsgShow');
            if(!extendMsgShow){
              const result = confirm("The token will expire in " + timeLeft + " seconds. If you want to extend 1 more minute, please press yes.");
              if (result === true) {
                const newExp = parseInt(exp) + 60;
                localStorage.setItem('exp', newExp.toString());
                // console.log("Token extended by 60 seconds");
              }else{
                localStorage.setItem('extendMsgShow', 'y');
              }
            }
          }
        }
    } catch (err) {
        console.log("Token is invalid");
        return false;
    }
    return true;
  }
}
