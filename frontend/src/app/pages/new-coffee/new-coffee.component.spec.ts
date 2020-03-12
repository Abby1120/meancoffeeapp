import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCoffeeComponent } from './new-coffee.component';

describe('NewCoffeeComponent', () => {
  let component: NewCoffeeComponent;
  let fixture: ComponentFixture<NewCoffeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCoffeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCoffeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
