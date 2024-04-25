import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaPermisionarioComponent } from './mapa-permisionario.component';

describe('MapaPermisionarioComponent', () => {
  let component: MapaPermisionarioComponent;
  let fixture: ComponentFixture<MapaPermisionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaPermisionarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaPermisionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
