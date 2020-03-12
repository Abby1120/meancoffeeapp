import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoasterComponent } from './new-roaster.component';

describe('NewRoasterComponent', () => {
  let component: NewRoasterComponent;
  let fixture: ComponentFixture<NewRoasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRoasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
