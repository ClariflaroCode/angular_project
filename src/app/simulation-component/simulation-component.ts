import {Component, Input} from '@angular/core';
import {i_simulation} from './simulation-interface';

@Component({
  selector: 'app-simulation-component',
  imports: [],
  templateUrl: './simulation-component.html',
  styleUrl: './simulation-component.css',
})
export class SimulationComponent {
  @Input()simulationData!: i_simulation;
  constructor() {
  }

}
