import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasPermisionarioComponent } from './rutas-permisionario.component';

describe('RutasPermisionarioComponent', () => {
  let component: RutasPermisionarioComponent;
  let fixture: ComponentFixture<RutasPermisionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutasPermisionarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutasPermisionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
