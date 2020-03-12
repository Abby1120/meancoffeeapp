import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoasterComponent } from './edit-roaster.component';

describe('EditRoasterComponent', () => {
  let component: EditRoasterComponent;
  let fixture: ComponentFixture<EditRoasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRoasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
