import { Component } from '@angular/core';
import {StateQueueComponent} from '../state-queue-component/state-queue-component';

@Component({
  selector: 'app-current-simulation-graph',
  imports: [
    StateQueueComponent
  ],
  templateUrl: './current-simulation-graph.html',
  styleUrl: './current-simulation-graph.css',
})
export class CurrentSimulationGraph {

}
