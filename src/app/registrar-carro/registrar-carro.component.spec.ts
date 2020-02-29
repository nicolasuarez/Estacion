import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCarroComponent } from './registrar-carro.component';

describe('RegistrarCarroComponent', () => {
  let component: RegistrarCarroComponent;
  let fixture: ComponentFixture<RegistrarCarroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarCarroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarCarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
