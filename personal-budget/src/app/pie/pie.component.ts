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

  private svg: any;
  private margin = 40;
  private width = 500;
  private height = 500;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2.5 - this.margin;
  private colors: any;

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 3 + "," + this.height / 2 + ")"
    );
  }

  private createColors(): void {
    this.colors = d3.scaleOrdinal()
    .domain(this.data.map(d => d.title.toString()))
    .range(this.data.map(d => d.color.toString()));
  }

  private drawChart(data: any[]): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.budget));

    // Build the pie chart
    this.svg
    .selectAll('pieces')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius)
    )
    .attr('fill', (d: any, i: any) => (this.colors(i)))
    .attr("stroke", "#ffffff") //line color
    .style("stroke-width", "1px");

    // Add labels
    const labelLocation = d3.arc()
    .innerRadius(100)
    .outerRadius(this.radius);

    this.svg
    .selectAll('pieces')
    .data(pie(data))
    .enter()
    .append('text')
    .text((d: any)=> d.data.title)
    .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 15);
  }

  ngOnInit(): void {

    const jwt = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userId');

    if(jwt){
      this.dataService.getBudgetData(userId).subscribe(
        (response: any) => {
          // console.log(response);
          if(response.success) {

            if(response.results.length > 0){
              for (var i = 0; i < response.results.length; i++){
                this.data.push({
                  title: response.results[i].title,
                  budget: response.results[i].budget,
                  color: response.results[i].color
                });
              }
              this.createSvg();
              this.createColors();
              this.drawChart(this.data);
            }
          }
        },
        (error) => {
          console.error('failed!', error);
        }
      );
    }
  }

}

