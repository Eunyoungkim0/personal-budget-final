import { DataService } from '../data.service';
import { Component, Input, OnInit } from "@angular/core";
import { BarChartDataItem } from "./bar-chart.model";

@Component({
  selector: 'pb-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {
  @Input("data") public data!: BarChartDataItem[];
  @Input("title") public title!: string;
  private svg: any;
  private margin = 70;
  private width = 700 - this.margin;
  private height = 700 - this.margin * 2;
  private totalBudget = 0;
  private totalExpense = 0;
  public isToggleOn: boolean = false;
  constructor(private d3: DataService) {}

  darkenColor(hex: string, percent: number) {
    // Remove the # if present
    hex = hex.replace('#', '');

    // Parse hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Darken each component by the percentage
    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));

    // Ensure values stay within valid range
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    // Convert RGB back to hex
    return `#${(r * 65536 + g * 256 + b).toString(16).padStart(6, '0')}`;
  }

  ngOnInit(): void {

    const jwt = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userId');

    if(jwt){
      this.d3.getBudgetData(userId).subscribe(
        (response: any) => {
          let highestCurrentValue = 0;
          if(response.success) {
            if(response.results.length > 0){
              const divChartToggle = document.getElementById('toggle') as HTMLElement;
              divChartToggle.setAttribute('class', 'row');

              for (var i = 0; i < response.results.length; i++){
                this.data.push({
                  title: response.results[i].title,
                  budget: response.results[i].budget,
                  color: response.results[i].color,
                  expense: response.results[i].expense
                });
                const barValue = Math.max(Number(response.results[i].budget), Number(response.results[i].expense));
                if (barValue > highestCurrentValue) {
                  highestCurrentValue = barValue;
                }
                this.totalBudget += response.results[i].budget;
              }
              this.height = highestCurrentValue + 25;
              this.createSvg();
              this.drawBars(this.data);
            }else{
              const divChartToggle = document.getElementById('toggle') as HTMLElement;
              divChartToggle.setAttribute('class', 'invisible');
            }
          }
        },
        (error) => {
          console.error('failed!', error);
        }
      );
    }
  }

  private createSvg(): void {

    const divChart = document.getElementById('chart') as HTMLCanvasElement;
    while (divChart.firstChild) {
      divChart.removeChild(divChart.firstChild);
    }

    this.svg = this.d3.d3
      .select("div#chart")
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${this.width + this.margin * 2} ${this.height + this.margin * 1.5}`
      )
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin * 0.3 + ")");
  }

  private drawBars(data: any[]): void {
    if (data && Array.isArray(data) && data.length > 0) {

        // Creating X-axis band scale
        const x = this.d3.d3
        .scaleBand()
        .range([0, this.width+30])
        .domain(data.map(d => d.title))
        .padding(0.5);

        // Drawing X-axis on the DOM
        this.svg
          .append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(this.d3.d3.axisBottom(x))
          .selectAll("text")
          .attr('transform', 'translate(-10, 0)rotate(-45)')
          .style('text-anchor', 'end')
          .style("font-size", "12px");

        // Create Y-axis band scale
        const y = this.d3.d3
          .scaleLinear()
          .domain([0, Number(this.height)])
          .range([this.height, 0]);

        // Draw the Y-axis on the DOM
        this.svg
          .append("g")
          .call(this.d3.d3.axisLeft(y))
          .selectAll("text")
          .style("font-size", "12px");

        // Create and fill the bars
        this.svg
          .selectAll("bars")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d: { title: string }) => x(d.title))
          .attr("y", (d: { budget: number }) => y(d.budget))
          // .attr("width", x.bandwidth())
            .attr("width", "20px")
          .attr("height", (d: { budget: number }) =>
            y(d.budget) < this.height ? this.height - y(d.budget) : this.height
          )
          .attr("fill", (d: { color: string }) => this.isToggleOn ? "gray" : d.color);

        if(this.isToggleOn){
          //Show expense
          this.svg
          .selectAll("bars")
          .data(data.filter(d => d.expense !== 0))
          .enter()
          .append("rect")
          .attr("x", (d: { title: string }) => x(d.title))
          .attr("y", (d: { expense: number }) => y(d.expense))
          .attr('transform', 'translate(+20, 0)')
          // .attr("width", x.bandwidth())
          .attr("width", "20px")
          .attr("height", (d: { expense: number }) =>
            y(d.expense) < this.height ? this.height - y(d.expense) : this.height
          )
          .attr("fill", (d: { color: string }) => this.darkenColor(d.color, 10));
          // .attr("fill", "black");

          this.svg
          .selectAll("text.bar")
          .data(data.filter(d => d.expense !== 0))
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("fill", "red")
          .attr("x", (d: { title: string }) => x(d.title))
          .attr("y", (d: { expense: number }) => y(d.expense))
          .attr('transform', 'translate(+30, -5)')
          .text((d: { expense: number }) => "$" + Math.round(d.expense * 100) / 100)
          .style("font-size", "10px");

          this.svg
          .selectAll("text.bar")
          .data(data.filter(d => d.expense !== 0))
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("fill", "red")
          .attr("x", (d: { title: string }) => x(d.title))
          .attr("y", (d: { expense: number }) => y(d.expense))
          .attr('transform', 'translate(+30, -20)')
          .text((d: { expense: number }) => "("+this.roundToDecimalPlaces(((d.expense * 100) / this.totalBudget), 1) + "%)")
          .style("font-size", "8px");
        }

          this.svg
          .selectAll("text.bar")
          .data(data)
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("fill", "#70747a")
          .attr("x", (d: { title: string }) => x(d.title))
          .attr("y", (d: { budget: number }) => y(d.budget))
          .attr('transform', 'translate(+10, -5)')
          .text((d: { budget: number }) => "$" + Math.round(d.budget * 100) / 100)
          .style("font-size", "10px");

          this.svg
          .selectAll("text.bar")
          .data(data)
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("fill", "#70747a")
          .attr("x", (d: { title: string }) => x(d.title))
          .attr("y", (d: { budget: number }) => y(d.budget))
          .attr('transform', 'translate(+10, -20)')
          .text((d: { budget: number }) => "("+this.roundToDecimalPlaces(((d.budget * 100) / this.totalBudget), 1) + "%)")
          .style("font-size", "8px");
    } else {
      console.error('Data is undefined or empty.');
    }
  }

  private roundToDecimalPlaces(num: number, decimalPlaces: number) {
   const factor = Math.pow(10, decimalPlaces);
   const result = Math.round(num * factor) / factor;
   const commaResult = result.toLocaleString();
   return commaResult;
 }

  showExpense() {
    const toggle = document.getElementById('switch') as HTMLInputElement;
    if(toggle){
      if(toggle.checked){
        this.isToggleOn = true;
      }else{
        this.isToggleOn = false;
      }
      this.createSvg();
      this.drawBars(this.data);
    }
  }

}

