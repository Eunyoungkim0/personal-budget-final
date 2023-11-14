import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit{
  constructor(private dataService: DataService) { }

  private data = [] as any[];
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

  private svg: any;
  private margin = 50;
  private width = 550;
  private height = 500;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;

  // private createSvg(): void {
  //   this.svg = d3.select("figure#pie")
  //   .append("svg")
  //   .attr("width", this.width)
  //   .attr("height", this.height)
  //   .append("g")
  //   .attr(
  //     "transform",
  //     "translate(" + this.width / 2 + "," + this.height / 2 + ")"
  //   );
  // }

  // private createColors(): void {
  //   this.colors = d3.scaleOrdinal()
  //   .domain(this.data.map(d => d.title.toString()))
  //   .range(['#ffcd56',
  //   '#ff6384',
  //   '#36a2eb',
  //   '#fd6b19',
  //   'green',
  //   'purple',
  //   'red']);
  // }

  // private drawChart(data: any[]): void {
  //   // Compute the position of each group on the pie:
  //   const pie = d3.pie<any>().value((d: any) => Number(d.budget));

  //   // Build the pie chart
  //   this.svg
  //   .selectAll('pieces')
  //   .data(pie(data))
  //   .enter()
  //   .append('path')
  //   .attr('d', d3.arc()
  //     .innerRadius(0)
  //     .outerRadius(this.radius)
  //   )
  //   .attr('fill', (d: any, i: any) => (this.colors(i)))
  //   .attr("stroke", "#ffffff") //line color
  //   .style("stroke-width", "1px");

  //   // Add labels
  //   const labelLocation = d3.arc()
  //   .innerRadius(100)
  //   .outerRadius(this.radius);

  //   this.svg
  //   .selectAll('pieces')
  //   .data(pie(data))
  //   .enter()
  //   .append('text')
  //   .text((d: any)=> d.data.title)
  //   .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
  //   .style("text-anchor", "middle")
  //   .style("font-size", 15);
  // }

  // createData(): void {
  //   this.dataSource = this.dataService.getData();

  //   const budget = this.dataSource.datasets[0].data;
  //   const titles = this.dataSource.labels;

  //   this.data = titles.map((title, index) => {
  //     return {
  //       title: title,
  //       budget: budget[index]
  //     };
  //   });

  // }

  ngOnInit(): void {

    // const budget = [] as any[];
    // const titles = [] as any[];

    // if(this.dataService.myBudget.length == 0){
    //   this.dataService.getData().subscribe((res:any) => {
    //     this.dataService.myBudget = res.myBudget;

    //     for (var i = 0; i < res.myBudget.length; i++){
    //       this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
    //       this.dataSource.labels[i] = res.myBudget[i].title;
    //       this.data.push({
    //         title: res.myBudget[i].title,
    //         budget: res.myBudget[i].budget
    //       });
    //     }
    //     this.createSvg();
    //     this.createColors();
    //     this.drawChart(this.data);
    //   });
    // }else{
    //   for (var i = 0; i < this.dataService.myBudget.length; i++){
    //     this.dataSource.datasets[0].data[i] = this.dataService.myBudget[i].budget;
    //     this.dataSource.labels[i] = this.dataService.myBudget[i].title;
    //     this.data.push({
    //       title: this.dataService.myBudget[i].title,
    //       budget: this.dataService.myBudget[i].budget
    //     });
    //   }
    //   this.createSvg();
    //   this.createColors();
    //   this.drawChart(this.data);
    // }

  }
}

