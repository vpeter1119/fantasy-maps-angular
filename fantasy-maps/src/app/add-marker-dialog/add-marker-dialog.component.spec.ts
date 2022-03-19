import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarkerDialogComponent } from './add-marker-dialog.component';

describe('AddMarkerDialogComponent', () => {
  let component: AddMarkerDialogComponent;
  let fixture: ComponentFixture<AddMarkerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarkerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarkerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
