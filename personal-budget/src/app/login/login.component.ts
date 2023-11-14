import { Component } from '@angular/core';

@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    login() {
      const userIdElement = document.getElementById('userId') as HTMLInputElement;
      const passwordElement = document.getElementById('password') as HTMLInputElement;

      if (userIdElement && passwordElement) {
        const data = {
          userId: userIdElement.value,
          password: passwordElement.value,
        };
        console.log(data);
      }
    }
    // axios.post('/api/login', data)
    //     .then(res => {
    //         document.getElementById('username').value = '';
    //         document.getElementById('password').value = '';
    //         if(res && res.data && res.data.success) {
    //             const token = res.data.token;
    //             const exp = res.data.exp;
    //             localStorage.setItem('jwt', token);
    //             localStorage.setItem('exp', exp);
    //             setInterval(isTokenValid, 180000); // 1000 milliseconds = 1 second
    //             getDashboard();
    //         }
    //     });

}
