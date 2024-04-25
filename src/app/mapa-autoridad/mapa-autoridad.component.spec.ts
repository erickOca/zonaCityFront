import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaAutoridadComponent } from './mapa-autoridad.component';

describe('MapaAutoridadComponent', () => {
  let component: MapaAutoridadComponent;
  let fixture: ComponentFixture<MapaAutoridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaAutoridadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaAutoridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
