import { Component } from '@angular/core';
import {SimulationComponent} from '../simulation-component/simulation-component';

@Component({
  selector: 'app-simulations-list-component',
  imports: [
    SimulationComponent
  ],
  templateUrl: './simulations-list-component.html',
  styleUrl: './simulations-list-component.css',
})
export class SimulationsListComponent {
  simulaciones = [];
}
