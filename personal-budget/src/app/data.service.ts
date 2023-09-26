import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private dataSource = {
    datasets: [
        {
            data: [] as any[],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                'green',
                'purple',
                'red',
            ]
        }
    ],
    labels: [] as any[]
  };

  public myBudget = [] as any[];

  constructor(private http: HttpClient) {  }
/*
  setData(): any{
    this.http.get('http://localhost:3000/budget').subscribe(res=> {
      const jsonData = res as any;
      this.data = jsonData.myBudget;
      return this.data;
    });
  }
*/
  getData(): any {
    return this.http.get('http://localhost:3000/budget');
  }
}
