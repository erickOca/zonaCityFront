import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapa2Component } from './mapa2.component';

describe('Mapa2Component', () => {
  let component: Mapa2Component;
  let fixture: ComponentFixture<Mapa2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mapa2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mapa2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
