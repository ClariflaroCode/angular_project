import { Component } from '@angular/core';
import {StateQueueComponent} from '../state-queue-component/state-queue-component';

@Component({
  selector: 'app-graph-component',
  imports: [StateQueueComponent],
  templateUrl: './graph-component.html',
  styleUrl: './graph-component.css',
})
export class GraphComponent {
    states = ['ready', 'running', 'waiting', 'terminated'];

}
