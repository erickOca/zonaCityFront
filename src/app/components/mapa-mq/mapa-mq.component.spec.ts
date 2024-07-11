import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaMqComponent } from './mapa-mq.component';

describe('MapaMqComponent', () => {
  let component: MapaMqComponent;
  let fixture: ComponentFixture<MapaMqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaMqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaMqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
