import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { BarChartDataItem } from '../bar-chart/bar-chart.model';
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'pb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  currentDataPoint: BarChartDataItem | null = null;

  public data: BarChartDataItem[] = [];
  public totalUserBudget: number = 0;
  public totalUserExpense: number = 0;
  public totalLeftAmount: number = 0;

  constructor(private dataService: DataService, private router: Router) {}
  public dataSource = {
    datasets: [
        {
            data: [] as any[],
            backgroundColor: [] as any[]
        }
    ],
    labels: [] as any[]
  };

  ngAfterViewInit(): void {
    const token = localStorage.getItem('jwt');
    const date = new Date();
    const month = date.getMonth() + 1;
    const strMonth = this.numericMonthToString(month);
    const year = date.getFullYear().toString();

    const budgetTitle = document.querySelector('#budget-title h1') as HTMLCanvasElement;
    budgetTitle.innerHTML += ' (' + strMonth + ')';
    const incomeTitle = document.querySelector('#income-title h1') as HTMLCanvasElement;
    incomeTitle.innerHTML += ' (' + strMonth + ')';

    if(!token){
      alert("Please log in to see the dashboard.");
      this.router.navigate(['/login']);
    }else{
      this.loadIncome(year, month);
      this.loadBudget();
    }
  }

  loadIncome(year: string, month: number) {
    const userId = localStorage.getItem('userId');
    const data = {
      userId : userId,
      year : year,
      month: month
    }
    this.dataService.getIncomeData(data).subscribe(
      (response: any) => {
        if(response.success && response.results != null) {
          this.createIncome(response.results.expense);
        } else {
          this.createIncome();
        }
      },
      (error) => {
        // console.error('failed!', error);
        this.createIncome();
      }
    );
  }

  loadBudget() {
    const userId = localStorage.getItem('userId');
    this.createTableTitle();
    this.dataService.getBudgetData(userId).subscribe(
      (response: any) => {
        // console.log(response);
        if(response.success && response.results.length > 0) {
          const noDataForCharts = document.getElementsByClassName('nodata') as HTMLCollectionOf<HTMLCanvasElement>;
          for (let i = 0; i < noDataForCharts.length; i++) {
            noDataForCharts[i].innerHTML = "";
            // noDataForCharts[i].setAttribute('class', 'div-invisible');
          }
          var totalBudget = 0;
          var totalExpense = 0;
          var totalLeft = 0;
          for (var i = 0; i < response.results.length; i++){
            var title =  response.results[i].title;
            var budget = response.results[i].budget;
            var color = response.results[i].color;
            var expense = response.results[i].expense;
            var budgetId = response.results[i].budgetId;
            totalBudget += budget;
            totalExpense += expense;
            if(expense == 0){
              totalLeft += budget;
            }else{
              totalLeft += expense;
            }

            this.createTable(title, budget, color, expense, budgetId);
            this.dataSource.datasets[0].data[i] = budget;
            this.dataSource.datasets[0].backgroundColor[i] = color;
            this.dataSource.labels[i] = title;
          }
          this.totalUserBudget = totalBudget;
          this.totalUserExpense = totalExpense;
          this.totalLeftAmount = totalLeft;
          this.createChart();
        }else {
          this.createTable();
        }
        this.createTableTotal();
      },
      (error) => {
        // console.error('failed!', error);
      }
    );
  }

  incomeValidation() {
    const inputIncome = document.getElementById('income') as HTMLInputElement;
    if(inputIncome){
      if(parseInt(inputIncome.value) == 0){
        alert("Please enter your income.");
        inputIncome.focus();
        return false;
      }
    }
    return true;
  }

  showResult() {
    if(this.incomeValidation()){
      const inputIncome = document.getElementById('income') as HTMLInputElement;
      const inputDesiredBalance = document.getElementById('dbalance') as HTMLInputElement;
      const divSummary = document.getElementById('budget-summary') as HTMLCanvasElement;

      while (divSummary.firstChild) {
        divSummary.removeChild(divSummary.firstChild);
      }

      divSummary.setAttribute('style', 'border: 1px gray solid; border-radius: 10px;');

      const divTitle = document.createElement('div');
      divTitle.setAttribute('style', 'margin:5px; padding:5px; font-weight:bold; font-size: 15px;');
      divTitle.innerHTML = '# Summary';

      const divIncomeFrame = document.createElement('div');
      divIncomeFrame.setAttribute('style', 'display: flex; flex-direction: row; margin: 5%;');
      const divIncomeTitle = document.createElement('div');
      divIncomeTitle.setAttribute('style', 'width: 65%; font-size: 14px; padding-left: 2%;');
      divIncomeTitle.innerHTML = 'Income';
      const divSymbol1 = document.createElement('div');
      divSymbol1.setAttribute('style', 'width: 5%; font-size: 14px;');
      divSymbol1.innerHTML = '$';
      const divIncome = document.createElement('div');
      divIncome.setAttribute('style', 'width: 30%; text-align: right; font-size: 14px; color: blue;');
      divIncome.innerHTML = parseFloat(inputIncome.value).toLocaleString();
      divIncomeFrame.appendChild(divIncomeTitle);
      divIncomeFrame.appendChild(divSymbol1);
      divIncomeFrame.appendChild(divIncome);

      const divBudgetFrame = document.createElement('div');
      divBudgetFrame.setAttribute('style', 'display: flex; flex-direction: row; margin: 5%;');
      const divBudgetTitle = document.createElement('div');
      divBudgetTitle.setAttribute('style', 'width: 65%; font-size: 14px; padding-left: 2%;');
      divBudgetTitle.innerHTML = 'Budget';
      const divSymbol2 = document.createElement('div');
      divSymbol2.setAttribute('style', 'width: 5%; font-size: 14px;');
      divSymbol2.innerHTML = '$';
      const divBudget = document.createElement('div');
      divBudget.setAttribute('style', 'width: 30%; text-align: right; font-size: 14px; color: black;');
      divBudget.innerHTML = this.totalUserBudget.toLocaleString();
      divBudgetFrame.appendChild(divBudgetTitle);
      divBudgetFrame.appendChild(divSymbol2);
      divBudgetFrame.appendChild(divBudget);


      const divExpenseFrame = document.createElement('div');
      divExpenseFrame.setAttribute('style', 'display: flex; flex-direction: row; margin: 5%;');
      const divExpenseTitle = document.createElement('div');
      divExpenseTitle.setAttribute('style', 'width: 65%; font-size: 14px; padding-left: 2%;');
      divExpenseTitle.innerHTML = 'Expense';
      const divSymbol3 = document.createElement('div');
      divSymbol3.setAttribute('style', 'width: 5%; font-size: 14px;');
      divSymbol3.innerHTML = '$';
      const divExpense = document.createElement('div');
      divExpense.setAttribute('style', 'width: 30%; text-align: right; font-size: 14px; color: red;');
      divExpense.innerHTML = this.totalUserExpense.toLocaleString();
      divExpenseFrame.appendChild(divExpenseTitle);
      divExpenseFrame.appendChild(divSymbol3);
      divExpenseFrame.appendChild(divExpense);


      const divBalanceFrame = document.createElement('div');
      divBalanceFrame.setAttribute('style', 'display: flex; flex-direction: row; margin: 5%; padding-top: 5%; border-top: 1px gray solid;');
      const divBalanceTitle = document.createElement('div');
      divBalanceTitle.setAttribute('style', 'width: 65%; font-size: 14px; padding-left: 2%;');
      divBalanceTitle.innerHTML = 'Balance';
      const divSymbol4 = document.createElement('div');
      divSymbol4.setAttribute('style', 'width: 5%; font-size: 14px;');
      divSymbol4.innerHTML = '$';
      const divBalance = document.createElement('div');
      divBalance.setAttribute('style', 'width: 30%; text-align: right; font-size: 14px; color: black;');
      divBalance.innerHTML = (parseFloat(inputIncome.value) - this.totalUserExpense).toLocaleString();
      divBalanceFrame.appendChild(divBalanceTitle);
      divBalanceFrame.appendChild(divSymbol4);
      divBalanceFrame.appendChild(divBalance);


      const divExBalanceFrame = document.createElement('div');
      divExBalanceFrame.setAttribute('style', 'display: flex; flex-direction: row; margin: 5%;');
      const divExBalanceTitle = document.createElement('div');
      divExBalanceTitle.setAttribute('style', 'width: 65%; font-size: 14px; padding-left: 2%;');
      divExBalanceTitle.innerHTML = 'Expected Balance';
      const divSymbol5 = document.createElement('div');
      divSymbol5.setAttribute('style', 'width: 5%; font-size: 14px;');
      divSymbol5.innerHTML = '$';
      const divExBalance = document.createElement('div');
      divExBalance.setAttribute('style', 'width: 30%; text-align: right; font-size: 14px; color: gray;');
      divExBalance.innerHTML = (parseFloat(inputIncome.value) - this.totalLeftAmount).toLocaleString();
      divExBalanceFrame.appendChild(divExBalanceTitle);
      divExBalanceFrame.appendChild(divSymbol5);
      divExBalanceFrame.appendChild(divExBalance);


      divSummary.appendChild(divTitle);
      divSummary.appendChild(divIncomeFrame);
      divSummary.appendChild(divBudgetFrame);
      divSummary.appendChild(divExpenseFrame);
      divSummary.appendChild(divBalanceFrame);
      divSummary.appendChild(divExBalanceFrame);


      if((parseFloat(inputIncome.value) - this.totalLeftAmount) >= parseFloat(inputDesiredBalance.value)){
        const divMessage = document.createElement('div');
        divMessage.setAttribute('style', 'padding: 5%; color: blue; font-weight:bold; font-size: 15px;');
        divMessage.innerHTML = "* You're doing an excellent job managing your budget this month!";
        divSummary.appendChild(divMessage);
      }else{
        const divMessage = document.createElement('div');
        divMessage.setAttribute('style', 'padding: 5%; color: red; font-weight:bold; font-size: 15px;');
        divMessage.innerHTML = "* Please consider adjustments to your budget for this month.";
        divSummary.appendChild(divMessage);
      }
    }
  }

  createChart() {
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
        options: {
          plugins: {
            datalabels: {
              color: 'black', // Label text color
              formatter: (value, ctx) => {
                // Format the label content here
                return `${ctx.chart.data.labels && ctx.chart.data.labels[ctx.dataIndex]}: ${value}%`;
              },
              anchor: 'end',
              align: 'start',
              offset: -10, // Position adjustment
            }
          }
        }
    });
  }

  createIncome(income=0) {
    const inputIncome = document.getElementById('income') as HTMLInputElement;
    if (inputIncome) {
      inputIncome.value = income.toString();
    }
  }

  createTableTitle(){
    const divForTable = document.getElementById('budget-list') as HTMLCanvasElement;
    const divForFrame = document.createElement('div');
    divForFrame.setAttribute('id', 'divTable');
    divForFrame.setAttribute('style', 'margin: 20px 10px 0px 10px;');
    divForTable.appendChild(divForFrame);


    const divTableRow = document.createElement('div');
    divTableRow.setAttribute('class', 'div-table-row');
    divTableRow.setAttribute('style', 'display: flex; flex-direction: row; padding: 5px; border-bottom: 1px #d9d9d9 solid; font-weight: bold; font-size: 13px;');
    const divTitle = document.createElement('div');
    divTitle.setAttribute('class', 'div-title');
    divTitle.setAttribute('style', 'display: flex; width: 36%; justify-content: center;');
    divTitle.innerHTML = "Title";
    const divBudget = document.createElement('div');
    divBudget.setAttribute('class', 'div-budget');
    divBudget.setAttribute('style', 'display: flex; width: 17%; justify-content: center;');
    divBudget.innerHTML = "Budget";
    const divColor = document.createElement('div');
    divColor.setAttribute('class', 'div-color');
    divColor.setAttribute('style', 'display: flex; width: 20%; justify-content: center;');
    divColor.innerHTML = "Color";
    const divExpense = document.createElement('div');
    divExpense.setAttribute('style', 'display: flex; width: 17%; justify-content: center;');
    divExpense.setAttribute('class', 'div-expense');
    divExpense.innerHTML = "Expense";
    divTableRow.appendChild(divTitle);
    divTableRow.appendChild(divBudget);
    divTableRow.appendChild(divColor);
    divTableRow.appendChild(divExpense);
    divForFrame.appendChild(divTableRow);
  }

  createTable(title="", budget=0, color="", expense=0, budgetId=0) {
    const divForTable = document.getElementById('budget-list') as HTMLCanvasElement;

    const divTableRow = document.createElement('div');
    divTableRow.setAttribute('class', 'div-table-row');
    divTableRow.setAttribute('style', 'display: flex; flex-direction: row; padding: 3px; border-bottom: 1px #d9d9d9 solid;');

    const divTitle = document.createElement('div');
    divTitle.setAttribute('class', 'div-title');
    divTitle.setAttribute('style', 'display: flex; width: 36%;');
    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('class', 'input-title');
    inputTitle.setAttribute('maxlength', '40');
    inputTitle.setAttribute('style', 'width: 100%; margin: 5px; padding: 5px; font-size: 12px;');
    inputTitle.value = title;
    divTitle.appendChild(inputTitle);

    const divBudget = document.createElement('div');
    divBudget.setAttribute('class', 'div-budget');
    divBudget.setAttribute('style', 'display: flex; width: 17%;');
    const inputBudget = document.createElement('input');
    inputBudget.setAttribute('type', 'number');
    inputBudget.setAttribute('class', 'input-budget');
    inputBudget.setAttribute('min', '0');
    inputBudget.setAttribute('style', 'width: 100%; margin: 5px; padding: 5px; font-size: 12px;');
    inputBudget.value = budget.toString();
    divBudget.appendChild(inputBudget);

    const divColor = document.createElement('div');
    divColor.setAttribute('class', 'div-color');
    divColor.setAttribute('style', 'display: flex; width: 20%;');
    const inputColor = document.createElement('input');
    inputColor.setAttribute('type', 'text');
    inputColor.setAttribute('class', 'input-color');
    inputColor.setAttribute('maxlength', '7');
    inputColor.setAttribute('style', 'width: 100%; margin: 5px; padding: 5px; font-size: 12px;');
    inputColor.value = color;
    divColor.appendChild(inputColor);

    const divExpense = document.createElement('div');
    divExpense.setAttribute('style', 'display: flex; width: 17%;');
    divExpense.setAttribute('class', 'div-expense');
    const inputExpense = document.createElement('input');
    inputExpense.setAttribute('type', 'number');
    inputExpense.setAttribute('class', 'input-expense');
    inputExpense.setAttribute('min', '0');
    inputExpense.setAttribute('style', 'width: 100%; margin: 5px; padding: 5px; font-size: 12px;');
    inputExpense.value = expense.toString();
    divExpense.appendChild(inputExpense)

    const divDelete = document.createElement('div');
    divDelete.setAttribute('style', 'display: flex; width: 10%; cursor: pointer;');
    divDelete.addEventListener('click', (event) => this.deleteBudget(event, budgetId));
    divDelete.setAttribute('class', 'div-delete');
    const imgDelete = document.createElement('img');
    imgDelete.setAttribute('src', '/assets/delete.png');
    imgDelete.setAttribute('style', 'width: 20px; height: 20px; margin-top: 10px; ');
    divDelete.appendChild(imgDelete);

    const inputBudgetId = document.createElement('input');
    inputBudgetId.setAttribute('type', 'text');
    inputBudgetId.setAttribute('class', 'input-budgetId');
    inputBudgetId.hidden = true;
    inputBudgetId.value = budgetId.toString();

    divForTable.appendChild(divTableRow);
    divTableRow.appendChild(divTitle);
    divTableRow.appendChild(divBudget);
    divTableRow.appendChild(divColor);
    divTableRow.appendChild(divExpense);
    divTableRow.appendChild(divDelete);
    divTableRow.appendChild(inputBudgetId);
  }

  createTableTotal(){
    const divForTable = document.getElementById('budget-total') as HTMLCanvasElement;

    const divTableRow = document.createElement('div');
    divTableRow.setAttribute('style', 'display: flex; flex-direction: row; padding: 5px; font-weight: bold; color:gray;');
    const divTitle = document.createElement('div');
    divTitle.setAttribute('style', 'display: flex; width: 36%; font-size: 18px; justify-content: center; padding-right: 10px;');
    divTitle.innerHTML = "Total";
    const divBudget = document.createElement('div');
    divBudget.setAttribute('style', 'display: flex; width: 17%; font-size: 18px; justify-content: right; padding-right: 10px;');
    divBudget.innerHTML = '$' + this.totalUserBudget.toLocaleString();
    const divColor = document.createElement('div');
    divColor.setAttribute('style', 'display: flex; width: 20%;');
    const divExpense = document.createElement('div');
    divExpense.setAttribute('style', 'display: flex; width: 17%; font-size: 18px; justify-content: right; padding-right: 10px; color:red;');
    divExpense.innerHTML = '$' + this.totalUserExpense.toLocaleString();
    divTableRow.appendChild(divTitle);
    divTableRow.appendChild(divBudget);
    divTableRow.appendChild(divColor);
    divTableRow.appendChild(divExpense);
    divForTable.appendChild(divTableRow);
  }

  addBudget() {
    this.createTable();
  }

  deleteBudget(event: Event, budgetId: number) {
    const images = document.querySelectorAll('#budget-list img');
    const userId = localStorage.getItem('userId');
    const data = {
      userId: userId,
      budgetId: budgetId
    }

    images.forEach((image, index) => {
    image.addEventListener('click', (event) => {
            const clickedImage = event.target as HTMLElement;
            if (clickedImage) {
              const parentDiv = clickedImage.parentElement;
              if(parentDiv) {
                const grandparentDiv = parentDiv.parentElement;
                if(grandparentDiv) grandparentDiv.remove();
              }
            }
        });
    });

    this.dataService.deleteBudget(data).subscribe(
      (response: any) => {
        if(response.success == false){
          alert(response.err);
        }else{
          location.reload();
        }

      },
      (error) => {
        console.error('Failed deleting data', error);
      }
    );
  }


  saveBudget() {
    if(this.dataValidation()){
      const titleInputs = document.getElementsByClassName('input-title') as HTMLCollectionOf<HTMLInputElement>;
      const budgetInputs = document.getElementsByClassName('input-budget') as HTMLCollectionOf<HTMLInputElement>;
      const colorInputs = document.getElementsByClassName('input-color') as HTMLCollectionOf<HTMLInputElement>;
      const expenseInputs = document.getElementsByClassName('input-expense') as HTMLCollectionOf<HTMLInputElement>;
      const budgetIdInputs = document.getElementsByClassName('input-budgetId') as HTMLCollectionOf<HTMLInputElement>;

      const userId = localStorage.getItem('userId');
      const titles: string[] = [];
      const budgets: number[] = [];
      const colors: string[] = [];
      const expenses: number[] = [];
      const budgetIds: number[] = [];

      for (let i = 0; i < titleInputs.length; i++) {
        titles.push(titleInputs[i].value);
        budgets.push(parseFloat(budgetInputs[i].value));
        colors.push(colorInputs[i].value);
        expenses.push(parseFloat(expenseInputs[i].value));
        budgetIds.push(parseFloat(budgetIdInputs[i].value));
      }

      const data = {
          userId: userId,
          titles: titles,
          budgets: budgets,
          colors: colors,
          expenses: expenses,
          budgetIds: budgetIds
      }

      this.dataService.saveBudget(data).subscribe(
        (response: any) => {
          console.log('Budget data is saved successfully!', response);
          if(response.success) {
            location.reload();
          }

        },
        (error) => {
          console.error('Failed saving budget data!', error);
        }
      );
    }
  }

  dataValidation(){
    const titleInputs = document.getElementsByClassName('input-title') as HTMLCollectionOf<HTMLInputElement>;
    const budgetInputs = document.getElementsByClassName('input-budget') as HTMLCollectionOf<HTMLInputElement>;
    const colorInputs = document.getElementsByClassName('input-color') as HTMLCollectionOf<HTMLInputElement>;
    const expenseInputs = document.getElementsByClassName('input-expense') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < titleInputs.length; i++) {
      const title = titleInputs[i].value;
      const budget = parseInt(budgetInputs[i].value);
      const color = colorInputs[i].value;
      const expense = parseInt(expenseInputs[i].value);
      if(title == ""){
        alert("Please enter title");
        titleInputs[i].focus();
        return false;
      }
      if(color == ""){
        alert("Please enter color");
        colorInputs[i].focus();
        return false;
      }
    }

    return true;
  }

  numericMonthToString(month: number) {
    // const months = [
    //   'January', 'February', 'March', 'April', 'May', 'June',
    //   'July', 'August', 'September', 'October', 'November', 'December'
    // ];

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    if (month >= 1 && month <= 12) {
      return months[month - 1];
    } else {
      return 'Invalid month';
    }
  }
}
