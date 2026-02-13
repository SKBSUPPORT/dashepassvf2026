import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlServicioPage } from './control-servicio.page';

describe('ControlServicioPage', () => {
  let component: ControlServicioPage;
  let fixture: ComponentFixture<ControlServicioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ControlServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
