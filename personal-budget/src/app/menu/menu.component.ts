import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'pb-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{
  loginText: string = 'Login';
  loginLink: string = '/login';
  constructor(private router: Router, private menuService: MenuService) {}

  ngOnInit(): void {
      const jwt = localStorage.getItem('jwt');
      const exp = localStorage.getItem('exp');

      if (jwt) {
        this.menuService.loginText$.subscribe((text) => {
          this.loginText = 'Logout';
        });
        this.menuService.loginLink$.subscribe((link) => {
          this.loginLink = '/';
        });
      }
  }

  handleClick() {
    const jwt = localStorage.getItem('jwt');
    const exp = localStorage.getItem('exp');

    if (jwt) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('exp');
      this.router.navigate(['/login']);
      this.menuService.loginText$.subscribe((text) => {
        this.loginText = 'Login';
      });
      this.menuService.loginLink$.subscribe((link) => {
        this.loginLink = '/login';
      });
    }
  }

}
