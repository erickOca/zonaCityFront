import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoRutaComponent } from './seguimiento-ruta.component';

describe('SeguimientoRutaComponent', () => {
  let component: SeguimientoRutaComponent;
  let fixture: ComponentFixture<SeguimientoRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoRutaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
