import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private apiUrl = 'http://localhost:3000/api';
  public d3 = d3;

  constructor(private http: HttpClient) { }

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }
  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
  getBudgetData(userId: any) {
    return this.http.get(`${this.apiUrl}/getBudgetData/${userId}`);
  }
  saveBudget(data: any){
    return this.http.post(`${this.apiUrl}/saveBudget`, data);
  }
  deleteBudget(data: any){
    return this.http.post(`${this.apiUrl}/deleteBudget`, data);
  }
  getIncomeData(data: any){
    return this.http.post(`${this.apiUrl}/getIncomeData`, data);
  }
}
