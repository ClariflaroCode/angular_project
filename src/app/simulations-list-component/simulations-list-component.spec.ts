import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationsListComponent } from './simulations-list-component';

describe('SimulationsListComponent', () => {
  let component: SimulationsListComponent;
  let fixture: ComponentFixture<SimulationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulationsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
