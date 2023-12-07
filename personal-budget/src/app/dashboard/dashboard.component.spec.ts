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
});
