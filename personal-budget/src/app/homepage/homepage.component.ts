import { Component, AfterViewInit } from '@angular/core';
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

  constructor(private dataService: DataService) {  }

  ngAfterViewInit(): void {
    if(this.dataService.myBudget.length == 0){
      this.dataService.getData().subscribe((res:any) => {
        this.dataService.myBudget = res.myBudget;
        for (var i = 0; i < res.myBudget.length; i++){
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart();
      });
    }else{
      for (var i = 0; i < this.dataService.myBudget.length; i++){
        this.dataSource.datasets[0].data[i] = this.dataService.myBudget[i].budget;
        this.dataSource.labels[i] = this.dataService.myBudget[i].title;
      }
      this.createChart();
    }
  }

  createChart() {
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }
}
