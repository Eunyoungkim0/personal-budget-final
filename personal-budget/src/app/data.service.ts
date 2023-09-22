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

  private myBudget = [] as any[];

  constructor(private http: HttpClient) {
    if (this.myBudget.length === 0) {
      this.fetchDataFromBackend();
    }
  }
/*
  setData(): any{
    this.http.get('http://localhost:3000/budget').subscribe(res=> {
      const jsonData = res as any;
      this.data = jsonData.myBudget;
      return this.data;
    });
  }
*/
  fetchDataFromBackend() {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (var i = 0; i < res.myBudget.length; i++){
          this.myBudget[i] = res.myBudget[i];
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
      });
  }

  getData(): any {
    if (this.myBudget.length === 0) {
      this.fetchDataFromBackend();
    }
    return this.dataSource;
  }
}
