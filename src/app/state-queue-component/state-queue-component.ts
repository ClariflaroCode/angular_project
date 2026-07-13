import {Component, Input, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {i_process} from '../process-component/process-interface';

@Component({
  selector: 'app-state-queue-component',
  imports: [
    RouterLink
  ],
  templateUrl: './state-queue-component.html',
  styleUrl: './state-queue-component.css',
})
export class StateQueueComponent {
  @Input() queueName: string = ''; //lo recibe del padre.
  constructor() {
  }
  getQueueName(){
    return this.queueName;
  }
}
