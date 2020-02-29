import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarGasolineraComponent } from './agregar-gasolinera.component';

describe('AgregarGasolineraComponent', () => {
  let component: AgregarGasolineraComponent;
  let fixture: ComponentFixture<AgregarGasolineraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarGasolineraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarGasolineraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
