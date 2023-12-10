import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { PieComponent } from '../pie/pie.component';
import { DashboardComponent } from './dashboard.component';
import { DataService } from '../data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, BarChartComponent, PieComponent],
      providers: [DataService],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //For unit test
  it('should return string value of the month when number is given', () => {
    expect(component.numericMonthToString(1)).toBe('Jan');
    expect(component.numericMonthToString(2)).toBe('Feb');
    expect(component.numericMonthToString(3)).toBe('Mar');
    expect(component.numericMonthToString(4)).toBe('Apr');
    expect(component.numericMonthToString(5)).toBe('May');
    expect(component.numericMonthToString(6)).toBe('June');
    expect(component.numericMonthToString(7)).toBe('July');
    expect(component.numericMonthToString(8)).toBe('Aug');
    expect(component.numericMonthToString(9)).toBe('Sep');
    expect(component.numericMonthToString(10)).toBe('Oct');
    expect(component.numericMonthToString(11)).toBe('Nov');
    expect(component.numericMonthToString(12)).toBe('Dec');
  });


  //For unit test
  it('should return false when income value is 0', () => {
    const inputIncome = document.createElement('input') as HTMLInputElement;
    inputIncome.id = 'income';
    inputIncome.value = '0';
    spyOn(document, 'getElementById').and.returnValue(inputIncome);

    expect(component.incomeValidation()).toBe(false);
  });


  //For unit test
  it('should return true when income value is not 0', () => {
    const inputIncome = document.createElement('input') as HTMLInputElement;
    inputIncome.id = 'income';
    inputIncome.value = '900';
    spyOn(document, 'getElementById').and.returnValue(inputIncome);

    expect(component.incomeValidation()).toBe(true);
  });

});
