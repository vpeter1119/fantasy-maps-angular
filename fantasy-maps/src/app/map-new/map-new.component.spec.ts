import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapNewComponent } from './map-new.component';

describe('MapNewComponent', () => {
  let component: MapNewComponent;
  let fixture: ComponentFixture<MapNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
