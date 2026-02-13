import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateUnitsPage } from './generate-units.page';

describe('GenerateUnitsPage', () => {
  let component: GenerateUnitsPage;
  let fixture: ComponentFixture<GenerateUnitsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GenerateUnitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
