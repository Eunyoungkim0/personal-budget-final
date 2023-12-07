import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleComponent } from '../article/article.component';
import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomepageComponent, ArticleComponent]
    });
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
