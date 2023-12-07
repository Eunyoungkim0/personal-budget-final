import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroComponent } from './hero.component';
import { DataService } from '../data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      providers: [DataService],
      imports: [HttpClientTestingModule, RouterModule.forRoot([])]
    });
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
