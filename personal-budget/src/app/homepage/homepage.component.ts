import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {  }

  gotoDashboard() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit() {
  }

}
