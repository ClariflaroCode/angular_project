import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateQueueComponent } from './state-queue-component';

describe('StateQueueComponent', () => {
  let component: StateQueueComponent;
  let fixture: ComponentFixture<StateQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateQueueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateQueueComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
