import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSimulationGraph } from './current-simulation-graph';

describe('CurrentSimulationGraph', () => {
  let component: CurrentSimulationGraph;
  let fixture: ComponentFixture<CurrentSimulationGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentSimulationGraph],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentSimulationGraph);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
