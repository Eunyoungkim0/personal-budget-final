import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private loginTextSubject = new BehaviorSubject<string>(''); // Initial value as empty string
  private loginLinkSubject = new BehaviorSubject<string>(''); // Initial value as empty string

  loginText$ = this.loginTextSubject.asObservable();
  loginLink$ = this.loginLinkSubject.asObservable();

  setLoginText(text: string) {
    this.loginTextSubject.next(text);
  }

  setLoginLink(link: string) {
    this.loginLinkSubject.next(link);
  }
}
