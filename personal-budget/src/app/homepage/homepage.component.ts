import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit{

  public dataSource = {
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

  constructor(private http: HttpClient, private dataService: DataService) {
  }

  ngAfterViewInit(): void {
    this.createChart();
/*
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    });
*/
  }

  createChart() {
    this.dataSource = this.dataService.getData();
    //var ctx = document.getElementById("myChart").getContext("2d");
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }
}
